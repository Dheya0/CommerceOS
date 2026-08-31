import { Request, Response, NextFunction } from 'express';
import { logger } from '../infrastructure/logger.ts';
import { metricsCollector } from '../infrastructure/metrics.ts';

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Skip verbose logs for static assets
  if (req.path.startsWith('/@') || req.path.startsWith('/src') || req.path.includes('.')) {
    return next();
  }

  const start = req.startTime || Date.now();

  res.on('finish', () => {
    const latencyMs = Date.now() - start;

    // Record in global metrics engine
    metricsCollector.recordHttpRequest(req.method, req.route?.path || req.path, res.statusCode, latencyMs);

    const context = {
      requestId: req.id,
      correlationId: req.correlationId,
      tenantId: req.tenantId || req.user?.tenantId,
      userId: req.user?.id,
      method: req.method,
      route: req.path,
      statusCode: res.statusCode,
      durationMs: latencyMs,
      ip: req.ip || req.socket.remoteAddress
    };

    if (res.statusCode >= 500) {
      logger.error(`HTTP ${req.method} ${req.path} -> ${res.statusCode} (${latencyMs}ms)`, null, context);
    } else if (res.statusCode >= 400) {
      logger.warn(`HTTP ${req.method} ${req.path} -> ${res.statusCode} (${latencyMs}ms)`, context);
    } else {
      logger.info(`HTTP ${req.method} ${req.path} -> ${res.statusCode} (${latencyMs}ms)`, context);
    }
  });

  next();
}
