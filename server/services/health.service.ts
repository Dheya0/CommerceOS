import { db as drizzleDb } from '../../src/db/index.ts';
import { sql } from 'drizzle-orm';
import { configService } from '../infrastructure/config.ts';
import { LifecycleManager } from '../infrastructure/lifecycle.ts';
import { metricsCollector } from '../infrastructure/metrics.ts';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  platform: string;
  version: string;
  terminating: boolean;
  checks: {
    database: {
      status: 'up' | 'down' | 'degraded';
      latencyMs: number;
      error?: string;
    };
    memory: {
      rssMb: number;
      heapUsedMb: number;
      heapTotalMb: number;
    };
    jobQueue: {
      status: 'healthy' | 'degraded';
      queueDepth: number;
    };
  };
}

export class HealthService {
  public static async getHealth(): Promise<HealthCheckResult> {
    const mem = process.memoryUsage();
    const startTime = Date.now();
    let dbStatus: 'up' | 'down' | 'degraded' = 'up';
    let dbLatency = 0;
    let dbError: string | undefined;

    try {
      if (drizzleDb) {
        await drizzleDb.execute(sql`SELECT 1`);
        dbLatency = Date.now() - startTime;
        if (dbLatency > 500) {
          dbStatus = 'degraded';
        }
      } else {
        dbStatus = 'down';
        dbError = 'Database connection not initialized';
      }
    } catch (err: any) {
      dbStatus = 'down';
      dbError = err.message || 'Database ping failed';
    }

    const isTerminating = LifecycleManager.isTerminating();
    const isHealthy = dbStatus === 'up' && !isTerminating;
    const isDegraded = dbStatus === 'degraded' || isTerminating;

    const metrics = metricsCollector.getSummary();

    return {
      status: isHealthy ? 'healthy' : (isDegraded ? 'degraded' : 'unhealthy'),
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: configService.get('env'),
      platform: configService.get('platformName'),
      version: 'v2 (Production Hardened & Reliable)',
      terminating: isTerminating,
      checks: {
        database: {
          status: dbStatus,
          latencyMs: dbLatency,
          error: dbError
        },
        memory: {
          rssMb: Math.round(mem.rss / 1024 / 1024),
          heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
          heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024)
        },
        jobQueue: {
          status: metrics.jobs.queueDepth > 100 ? 'degraded' : 'healthy',
          queueDepth: metrics.jobs.queueDepth
        }
      }
    };
  }

  public static async getReadiness(): Promise<{ ready: boolean; reason?: string }> {
    if (LifecycleManager.isTerminating()) {
      return { ready: false, reason: 'Server is currently undergoing graceful termination' };
    }

    try {
      if (!drizzleDb) {
        return { ready: false, reason: 'Database instance unavailable' };
      }
      await drizzleDb.execute(sql`SELECT 1`);
      return { ready: true };
    } catch (err: any) {
      return { ready: false, reason: err.message || 'Database readiness probe failed' };
    }
  }
}
