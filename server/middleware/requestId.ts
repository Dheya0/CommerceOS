import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

declare global {
  namespace Express {
    interface Request {
      id: string;
      correlationId: string;
      startTime: number;
    }
  }
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incomingRequestId = req.headers['x-request-id'] as string;
  const incomingCorrelationId = req.headers['x-correlation-id'] as string;

  const requestId = incomingRequestId || `req_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const correlationId = incomingCorrelationId || requestId;

  req.id = requestId;
  req.correlationId = correlationId;
  req.startTime = Date.now();

  res.setHeader('X-Request-Id', requestId);
  res.setHeader('X-Correlation-Id', correlationId);

  next();
}
