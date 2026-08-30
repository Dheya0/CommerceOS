import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

// Add global connection pool caching to persist across hot-reloads
declare global {
  var _postgresPool: Pool | undefined;
}

// Function to create or retrieve the connection pool.
export const createPool = (): Pool => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    // Prevent unhandled pool-level errors from crashing the application
    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

// Create or retrieve the pool instance.
export const pool = createPool();

// Initialize Drizzle with the pool and schema.
export const db = drizzle(pool, { schema });

/**
 * Health check helper for PostgreSQL connection & latency probe
 */
export async function checkDbHealth(): Promise<{
  connected: boolean;
  latencyMs: number;
  totalCount: number;
  idleCount: number;
  waitingCount: number;
  database: string;
  error?: string;
}> {
  const start = performance.now();
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1 as alive');
      const latencyMs = Math.round(performance.now() - start);
      return {
        connected: true,
        latencyMs,
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount,
        database: process.env.SQL_DB_NAME || 'commerceos_db',
      };
    } finally {
      client.release();
    }
  } catch (err: any) {
    return {
      connected: false,
      latencyMs: Math.round(performance.now() - start),
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount,
      database: process.env.SQL_DB_NAME || 'commerceos_db',
      error: err.message || 'Database connection error',
    };
  }
}
