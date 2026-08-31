import { db as drizzleDb } from '../../src/db/index.ts';
import { backgroundJobs, distributedLocks } from '../../src/db/schema.ts';
import { eq, and, lte, or, isNull, sql } from 'drizzle-orm';
import crypto from 'crypto';
import { logger } from '../infrastructure/logger.ts';
import { metricsCollector } from '../infrastructure/metrics.ts';

export type JobHandler = (payload: any, jobId: string) => Promise<void>;

export class JobService {
  private static handlers: Map<string, JobHandler> = new Map();
  private static isWorkerRunning = false;
  private static workerInterval: NodeJS.Timeout | null = null;
  private static readonly instanceId = `worker_${process.pid}_${crypto.randomBytes(3).toString('hex')}`;

  /**
   * Registers a job processor for a specific jobType.
   */
  public static registerHandler(jobType: string, handler: JobHandler): void {
    this.handlers.set(jobType, handler);
  }

  /**
   * Enqueues a background job durably into PostgreSQL.
   */
  public static async enqueueJob(
    jobType: string,
    payload: any,
    tenantId?: string,
    options: { maxAttempts?: number; delaySeconds?: number } = {}
  ): Promise<string> {
    const id = `job_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const maxAttempts = options.maxAttempts ?? 3;
    const scheduledFor = new Date(Date.now() + (options.delaySeconds ?? 0) * 1000);

    if (drizzleDb) {
      await drizzleDb.insert(backgroundJobs).values({
        id,
        tenantId: tenantId || null,
        jobType,
        payload,
        status: 'queued',
        attempts: 0,
        maxAttempts,
        scheduledFor,
        createdAt: new Date()
      });
    }

    logger.info(`[Job Enqueued] ${jobType} (${id}) scheduled for ${scheduledFor.toISOString()}`);
    return id;
  }

  /**
   * Processes a batch of pending jobs with atomic locking.
   */
  public static async processNextBatch(batchSize: number = 10): Promise<number> {
    if (!drizzleDb) return 0;

    const now = new Date();
    const lockExpiry = new Date(now.getTime() + 60 * 1000); // 60s lock TTL

    // Find and lock available jobs (queued or expired lock)
    const availableJobs = await drizzleDb
      .select()
      .from(backgroundJobs)
      .where(
        and(
          eq(backgroundJobs.status, 'queued'),
          lte(backgroundJobs.scheduledFor, now),
          or(
            isNull(backgroundJobs.lockedUntil),
            lte(backgroundJobs.lockedUntil, now)
          )
        )
      )
      .limit(batchSize);

    if (availableJobs.length === 0) {
      return 0;
    }

    let processedCount = 0;

    for (const job of availableJobs) {
      // Try to acquire lock for this specific job
      const lockAcquired = await drizzleDb
        .update(backgroundJobs)
        .set({
          status: 'processing',
          lockedBy: this.instanceId,
          lockedUntil: lockExpiry,
          processedAt: now
        })
        .where(
          and(
            eq(backgroundJobs.id, job.id),
            eq(backgroundJobs.status, 'queued')
          )
        )
        .returning();

      if (lockAcquired.length === 0) {
        continue; // Locked by another concurrent worker instance
      }

      const handler = this.handlers.get(job.jobType);
      const attemptNum = job.attempts + 1;

      try {
        if (!handler) {
          throw new Error(`No registered handler found for jobType: ${job.jobType}`);
        }

        logger.info(`[Job Processing] ${job.jobType} (ID: ${job.id}, Attempt: ${attemptNum}/${job.maxAttempts})`);
        await handler(job.payload, job.id);

        // Mark as completed
        await drizzleDb
          .update(backgroundJobs)
          .set({
            status: 'completed',
            attempts: attemptNum,
            completedAt: new Date(),
            lockedBy: null,
            lockedUntil: null
          })
          .where(eq(backgroundJobs.id, job.id));

        logger.info(`[Job Succeeded] ${job.jobType} (ID: ${job.id})`);
        processedCount++;
      } catch (err: any) {
        logger.error(`[Job Failed] ${job.jobType} (ID: ${job.id}, Attempt: ${attemptNum}/${job.maxAttempts}): ${err.message}`, err);

        if (attemptNum >= job.maxAttempts) {
          // Move to Dead Letter Queue (DLQ)
          await drizzleDb
            .update(backgroundJobs)
            .set({
              status: 'dead_letter',
              attempts: attemptNum,
              lastError: err.message || 'Exhausted retry attempts',
              lockedBy: null,
              lockedUntil: null
            })
            .where(eq(backgroundJobs.id, job.id));

          logger.error(`[DLQ Transition] Job ${job.id} (${job.jobType}) routed to Dead Letter Queue after ${attemptNum} failed attempts.`);
        } else {
          // Exponential backoff for retry: 10s * 2^(attempt-1)
          const backoffDelaySec = Math.min(10 * Math.pow(2, attemptNum - 1), 300);
          const nextRun = new Date(Date.now() + backoffDelaySec * 1000);

          await drizzleDb
            .update(backgroundJobs)
            .set({
              status: 'queued',
              attempts: attemptNum,
              lastError: err.message,
              scheduledFor: nextRun,
              lockedBy: null,
              lockedUntil: null
            })
            .where(eq(backgroundJobs.id, job.id));

          logger.warn(`[Job Rescheduled] ${job.jobType} (ID: ${job.id}) scheduled for retry at ${nextRun.toISOString()} in ${backoffDelaySec}s`);
        }
      }
    }

    return processedCount;
  }

  /**
   * Distributed Lock: Acquires a database-backed mutex with TTL.
   */
  public static async acquireDistributedLock(
    resourceKey: string,
    ttlSeconds: number = 60
  ): Promise<{ acquired: boolean; ownerToken: string }> {
    if (!drizzleDb) return { acquired: false, ownerToken: '' };

    const ownerToken = `lock_${this.instanceId}_${crypto.randomBytes(4).toString('hex')}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);

    try {
      // 1. Try clean insert
      await drizzleDb.insert(distributedLocks).values({
        resourceKey,
        ownerToken,
        acquiredAt: now,
        expiresAt
      });
      return { acquired: true, ownerToken };
    } catch {
      // 2. If exists, check if expired and claim
      const updated = await drizzleDb
        .update(distributedLocks)
        .set({
          ownerToken,
          acquiredAt: now,
          expiresAt
        })
        .where(
          and(
            eq(distributedLocks.resourceKey, resourceKey),
            lte(distributedLocks.expiresAt, now)
          )
        )
        .returning();

      return { acquired: updated.length > 0, ownerToken };
    }
  }

  /**
   * Distributed Lock: Releases the database-backed mutex safely.
   */
  public static async releaseDistributedLock(
    resourceKey: string,
    ownerToken: string
  ): Promise<boolean> {
    if (!drizzleDb) return true;

    const result = await drizzleDb
      .delete(distributedLocks)
      .where(
        and(
          eq(distributedLocks.resourceKey, resourceKey),
          eq(distributedLocks.ownerToken, ownerToken)
        )
      )
      .returning();

    return result.length > 0;
  }

  /**
   * Starts periodic worker loop.
   */
  public static startWorker(intervalMs: number = 5000): void {
    if (this.isWorkerRunning) return;
    this.isWorkerRunning = true;

    this.workerInterval = setInterval(async () => {
      try {
        await this.processNextBatch(10);
      } catch (err) {
        logger.error('[Background Worker Error]', err);
      }
    }, intervalMs);

    logger.info(`[Background Worker] Started polling every ${intervalMs}ms (Worker ID: ${this.instanceId})`);
  }

  /**
   * Stops worker gracefully on shutdown.
   */
  public static stopWorker(): void {
    if (this.workerInterval) {
      clearInterval(this.workerInterval);
      this.workerInterval = null;
    }
    this.isWorkerRunning = false;
    logger.info('[Background Worker] Stopped cleanly');
  }
}
