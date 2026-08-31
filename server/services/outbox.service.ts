import { db } from '../../src/db/index.ts';
import { outboxEvents } from '../../src/db/schema.ts';
import { eq, and, sql, lt } from 'drizzle-orm';
import crypto from 'crypto';

export interface OutboxMessage {
  tenantId: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: Record<string, any>;
}

export class OutboxService {
  /**
   * Records an outbox event within an existing database transaction.
   * This guarantees atomic persistence alongside the business mutation.
   */
  static async recordEvent(tx: any, message: OutboxMessage): Promise<string> {
    const id = `outbox_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const executor = tx || db;

    await executor.insert(outboxEvents).values({
      id,
      tenantId: message.tenantId,
      eventType: message.eventType,
      aggregateType: message.aggregateType,
      aggregateId: message.aggregateId,
      payload: message.payload,
      status: 'pending',
      retryCount: 0,
      createdAt: new Date()
    });

    return id;
  }

  /**
   * Processes a batch of pending outbox events (at-least-once delivery worker).
   */
  static async processPendingEvents(batchSize = 20): Promise<{ processed: number; failed: number }> {
    let processed = 0;
    let failed = 0;

    try {
      const pending = await db
        .select()
        .from(outboxEvents)
        .where(
          and(
            eq(outboxEvents.status, 'pending'),
            lt(outboxEvents.retryCount, 5)
          )
        )
        .limit(batchSize);

      for (const event of pending) {
        try {
          // Dispatch event to listeners / webhooks / integrations
          await this.dispatchEvent(event);

          await db
            .update(outboxEvents)
            .set({
              status: 'published',
              processedAt: new Date()
            })
            .where(eq(outboxEvents.id, event.id));

          processed++;
        } catch (err: any) {
          failed++;
          await db
            .update(outboxEvents)
            .set({
              status: event.retryCount + 1 >= 5 ? 'failed' : 'pending',
              retryCount: sql`${outboxEvents.retryCount} + 1`,
              errorMessage: err.message || 'Dispatch error'
            })
            .where(eq(outboxEvents.id, event.id));
        }
      }
    } catch (err) {
      console.error('[OutboxService] Worker loop error:', err);
    }

    return { processed, failed };
  }

  private static async dispatchEvent(event: any): Promise<void> {
    // In production, this can forward to Webhook endpoints, Email providers, or Kafka/PubSub
    // Simulating deterministic dispatch without throwing operational errors
    if (process.env.DEBUG_OUTBOX) {
      console.log(`[Outbox Event Published] ${event.eventType} for ${event.aggregateType}:${event.aggregateId}`);
    }
  }
}
