import { db as drizzleDb } from '../../src/db/index.ts';
import { sql } from 'drizzle-orm';
import { configService } from '../infrastructure/config.ts';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  platform: string;
  version: string;
  checks: {
    database: {
      status: 'up' | 'down';
      latencyMs?: number;
      error?: string;
    };
    memory: {
      rssMb: number;
      heapUsedMb: number;
      heapTotalMb: number;
    };
  };
}

export class HealthService {
  public static async getHealth(): Promise<HealthCheckResult> {
    const mem = process.memoryUsage();
    const startTime = Date.now();
    let dbStatus: 'up' | 'down' = 'up';
    let dbLatency = 0;
    let dbError: string | undefined;

    try {
      if (drizzleDb) {
        await drizzleDb.execute(sql`SELECT 1`);
        dbLatency = Date.now() - startTime;
      }
    } catch (err: any) {
      dbStatus = 'down';
      dbError = err.message || 'Database ping failed';
    }

    const isHealthy = dbStatus === 'up';

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: configService.get('env'),
      platform: configService.get('platformName'),
      version: '3.9.0-enterprise',
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
        }
      }
    };
  }

  public static async getReadiness(): Promise<{ ready: boolean; reason?: string }> {
    try {
      if (drizzleDb) {
        await drizzleDb.execute(sql`SELECT 1`);
      }
      return { ready: true };
    } catch (err: any) {
      return { ready: false, reason: err.message };
    }
  }
}
