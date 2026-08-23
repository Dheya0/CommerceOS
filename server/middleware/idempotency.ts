import { Request, Response, NextFunction } from 'express';

interface CachedResponse {
  statusCode: number;
  headers: Record<string, any>;
  body: any;
  timestamp: number;
}

const idempotencyCache = new Map<string, CachedResponse>();
const IDEMPOTENCY_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

/**
 * Middleware that inspects 'Idempotency-Key' / 'X-Idempotency-Key' headers.
 * If key was previously processed, replay identical cached response to avoid double transactions.
 */
export function idempotencyMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only apply to mutating requests (POST, PUT, PATCH)
  if (req.method === 'GET' || req.method === 'OPTIONS' || req.method === 'HEAD') {
    return next();
  }

  const idempotencyKey = (req.headers['idempotency-key'] || req.headers['x-idempotency-key']) as string | undefined;

  if (!idempotencyKey) {
    return next();
  }

  const tenantId = (req as any).tenantId || 'global';
  const compositeKey = `${tenantId}:${req.path}:${idempotencyKey}`;

  const cached = idempotencyCache.get(compositeKey);
  if (cached && Date.now() - cached.timestamp < IDEMPOTENCY_TTL_MS) {
    res.setHeader('X-Idempotent-Replay', 'true');
    return res.status(cached.statusCode).json(cached.body);
  }

  // Intercept response to cache it
  const originalJson = res.json.bind(res);

  res.json = (body: any) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      idempotencyCache.set(compositeKey, {
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        body,
        timestamp: Date.now()
      });
    }
    return originalJson(body);
  };

  next();
}
