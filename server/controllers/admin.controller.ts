import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller.ts';
import { ReconciliationService } from '../services/reconciliation.service.ts';
import { OperationalControls, OperationalMode } from '../middleware/tenantOperationalMode.ts';
import { metricsCollector } from '../infrastructure/metrics.ts';
import { db as drizzleDb } from '../../src/db/index.ts';
import { backgroundJobs, distributedLocks, outboxEvents } from '../../src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import { JobService } from '../services/job.service.ts';

export class AdminController extends BaseController {
  /**
   * Triggers full reconciliation on demand with distributed lock.
   */
  public runReconciliation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const report = await ReconciliationService.runFullReconciliation();
      if (!report) {
        return this.sendSuccess(res, {
          status: 'locked',
          message: 'عملية المطابقة قيد التنفيذ حالياً بواسطة عامل آخر'
        });
      }
      this.sendSuccess(res, report);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Sets the operational mode of a tenant.
   */
  public setTenantOperationalMode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tenantId } = req.params;
      const { mode } = req.body as { mode: OperationalMode };

      const allowedModes: OperationalMode[] = ['NORMAL', 'READ_ONLY', 'CHECKOUT_DISABLED', 'SUSPENDED', 'MAINTENANCE'];
      if (!allowedModes.includes(mode)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_MODE',
            message: `وضع التشغيل غير صالح. الأوضاع المسموحة: ${allowedModes.join(', ')}`
          }
        });
      }

      OperationalControls.setTenantMode(tenantId, mode);

      this.sendSuccess(res, {
        tenantId,
        mode,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Gets system metrics summary.
   */
  public getSystemMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = metricsCollector.getSummary();
      this.sendSuccess(res, summary);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Gets Background Jobs / DLQ inspection.
   */
  public getJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!drizzleDb) {
        return this.sendSuccess(res, { jobs: [] });
      }

      const status = req.query.status as string | undefined;
      const query = drizzleDb.select().from(backgroundJobs);
      
      const jobs = status 
        ? await drizzleDb.select().from(backgroundJobs).where(eq(backgroundJobs.status, status)).orderBy(desc(backgroundJobs.createdAt)).limit(50)
        : await drizzleDb.select().from(backgroundJobs).orderBy(desc(backgroundJobs.createdAt)).limit(50);

      this.sendSuccess(res, { jobs });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Retries a Dead Letter Queue (DLQ) job.
   */
  public retryJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!drizzleDb) {
        return this.sendSuccess(res, { message: 'DB not available' });
      }

      await drizzleDb
        .update(backgroundJobs)
        .set({
          status: 'queued',
          attempts: 0,
          scheduledFor: new Date(),
          lockedBy: null,
          lockedUntil: null
        })
        .where(eq(backgroundJobs.id, id));

      this.sendSuccess(res, { message: 'تمت إعادة جدولة المهمة بنجاح' });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Gets Outbox events inspection.
   */
  public getOutboxEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!drizzleDb) {
        return this.sendSuccess(res, { events: [] });
      }

      const events = await drizzleDb
        .select()
        .from(outboxEvents)
        .orderBy(desc(outboxEvents.createdAt))
        .limit(50);

      this.sendSuccess(res, { events });
    } catch (err) {
      next(err);
    }
  };
}

export const adminController = new AdminController();
