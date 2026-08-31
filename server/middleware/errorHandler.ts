import { Request, Response, NextFunction } from 'express';
import { AppError } from '../domain/errors.ts';
import { logger } from '../infrastructure/logger.ts';
import { metricsCollector } from '../infrastructure/metrics.ts';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isOperational = err instanceof AppError && err.isOperational;
  const statusCode = (err instanceof AppError && err.statusCode) ? err.statusCode : (err.status || 500);
  const errorCode = (err instanceof AppError && err.errorCode) ? err.errorCode : (err.code || 'INTERNAL_ERROR');
  const message = err.message || 'حدث خطأ غير متوقع في الخادم';

  const requestId = req.id || (res.getHeader('X-Request-Id') as string) || `req_${Date.now()}`;
  const correlationId = req.correlationId || requestId;

  // Record error metric
  metricsCollector.recordError(statusCode, errorCode);

  const context = {
    requestId,
    correlationId,
    tenantId: req.tenantId || req.user?.tenantId,
    userId: req.user?.id,
    route: req.path,
    method: req.method,
    statusCode,
    errorCode,
    isOperational
  };

  if (statusCode >= 500) {
    logger.error(`[Server Exception] ${message}`, err, context);
  } else {
    logger.warn(`[Client Error] ${errorCode}: ${message}`, context, err.details);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(err.details ? { details: err.details } : {})
    },
    requestId
  });
}
