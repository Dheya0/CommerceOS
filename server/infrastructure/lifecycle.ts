import { Server } from 'http';
import { logger } from './logger.ts';
import { JobService } from '../services/job.service.ts';

let isShuttingDown = false;
let activeRequestsCount = 0;

export class LifecycleManager {
  private static readonly SHUTDOWN_TIMEOUT_MS = 10000;

  public static isTerminating(): boolean {
    return isShuttingDown;
  }

  public static trackRequestStart(): void {
    activeRequestsCount++;
  }

  public static trackRequestEnd(): void {
    activeRequestsCount = Math.max(0, activeRequestsCount - 1);
  }

  public static getActiveRequestsCount(): number {
    return activeRequestsCount;
  }

  public static setupGracefulShutdown(server: Server): void {
    const handleSignal = async (signal: string) => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      logger.warn(`[Lifecycle] Received ${signal} signal. Initiating graceful shutdown...`);

      // 1. Stop accepting new connections
      server.close((err) => {
        if (err) {
          logger.error('[Lifecycle] Error closing HTTP listener', err);
        } else {
          logger.info('[Lifecycle] HTTP listener closed. No longer accepting new connections.');
        }
      });

      // 2. Stop background jobs and workers
      try {
        JobService.stopWorker();
      } catch (err) {
        logger.error('[Lifecycle] Error stopping background worker', err);
      }

      // 3. Wait for active in-flight requests with timeout
      const startTime = Date.now();
      while (activeRequestsCount > 0 && Date.now() - startTime < this.SHUTDOWN_TIMEOUT_MS) {
        logger.info(`[Lifecycle] Waiting for ${activeRequestsCount} active in-flight request(s) to complete...`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (activeRequestsCount > 0) {
        logger.warn(`[Lifecycle] Shutdown timeout reached with ${activeRequestsCount} remaining active requests. Forcing termination.`);
      } else {
        logger.info('[Lifecycle] All in-flight requests completed successfully.');
      }

      // 4. Final log flush & Exit
      logger.info('[Lifecycle] Graceful shutdown sequence completed. Process exiting cleanly.');
      process.exit(0);
    };

    process.on('SIGTERM', () => handleSignal('SIGTERM'));
    process.on('SIGINT', () => handleSignal('SIGINT'));
  }
}
