import { Request, Response, NextFunction } from 'express';
import { AppError } from '../domain/errors.ts';
import { logger } from '../infrastructure/logger.ts';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isOperational = err instanceof AppError && err.isOperational;
  const statusCode = (err instanceof AppError && err.statusCode) ? err.statusCode : (err.status || 500);
  const errorCode = (err instanceof AppError && err.errorCode) ? err.errorCode : (err.code || 'INTERNAL_SERVER_ERROR');
  const message = err.message || 'حدث خطأ غير متوقع في الخادم';

  const context = {
    requestId: req.id,
    correlationId: req.correlationId,
    tenantId: req.tenantId || req.user?.tenantId,
    userId: req.user?.id,
    method: req.method,
    path: req.path,
    statusCode,
    errorCode,
    isOperational
  };

  if (statusCode >= 500) {
    logger.error(`[Unhandled Exception] ${message}`, err, context);
  } else {
    logger.warn(`[Client Error] ${errorCode}: ${message}`, context, err.details);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      details: err.details || undefined
    },
    requestId: req.id,
    timestamp: new Date().toISOString()
  });
}
