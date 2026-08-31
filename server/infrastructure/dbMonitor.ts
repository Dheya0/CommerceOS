import { db as drizzleDb } from '../../src/db/index.ts';
import { sql } from 'drizzle-orm';
import { logger } from './logger.ts';
import { metricsCollector } from './metrics.ts';

export class DatabaseMonitor {
  private static readonly SLOW_QUERY_WARN_MS = 250;
  private static readonly SLOW_QUERY_ERROR_MS = 1000;

  /**
   * Executes a database query wrapper with latency tracking and slow query alerts.
   */
  public static async executeTracked<T>(
    queryName: string,
    queryFn: () => Promise<T>
  ): Promise<T> {
    const start = Date.now();
    try {
      const result = await queryFn();
      const durationMs = Date.now() - start;

      metricsCollector.recordDbQuery(durationMs);

      if (durationMs > this.SLOW_QUERY_ERROR_MS) {
        logger.error(`[Slow Query Critical] ${queryName} took ${durationMs}ms`, null, {
          queryName,
          durationMs
        });
      } else if (durationMs > this.SLOW_QUERY_WARN_MS) {
        logger.warn(`[Slow Query Alert] ${queryName} took ${durationMs}ms`, {
          queryName,
          durationMs
        });
      }

      return result;
    } catch (err: any) {
      const durationMs = Date.now() - start;
      metricsCollector.recordDbQuery(durationMs);
      logger.error(`[DB Query Error] ${queryName} failed after ${durationMs}ms: ${err.message}`, err);
      throw err;
    }
  }

  /**
   * Checks database connectivity and retrieves connection statistics.
   */
  public static async getPoolStats(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    latencyMs: number;
    activeConnections?: number;
    error?: string;
  }> {
    const start = Date.now();
    try {
      if (!drizzleDb) {
        return { status: 'down', latencyMs: 0, error: 'Database instance not initialized' };
      }

      await drizzleDb.execute(sql`SELECT 1`);
      const latencyMs = Date.now() - start;

      return {
        status: latencyMs > 500 ? 'degraded' : 'healthy',
        latencyMs
      };
    } catch (err: any) {
      return {
        status: 'down',
        latencyMs: Date.now() - start,
        error: err.message || 'Ping failed'
      };
    }
  }
}
