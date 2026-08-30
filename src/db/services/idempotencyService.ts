import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db } from '../index.ts';
import { idempotencyKeys } from '../schema.ts';
import { eq, and, gt } from 'drizzle-orm';

export class IdempotencyService {
  /**
   * Generates a deterministic SHA-256 hash of the request payload
   */
  static hashPayload(body: any): string {
    const stringified = JSON.stringify(body || {});
    return crypto.createHash('sha256').update(stringified).digest('hex');
  }

  /**
   * Express Middleware for PostgreSQL-backed Idempotency
   */
  static middleware(options: { ttlHours?: number } = {}) {
    const ttlHours = options.ttlHours || 24;

    return async (req: Request, res: Response, next: NextFunction) => {
      // Only enforce idempotency for mutation methods (POST, PUT, PATCH, DELETE)
      if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        return next();
      }

      const idempotencyKey = (
        req.headers['idempotency-key'] ||
        req.headers['x-idempotency-key']
      ) as string | undefined;

      // If client didn't supply an idempotency key, proceed normally
      if (!idempotencyKey || typeof idempotencyKey !== 'string' || !idempotencyKey.trim()) {
        return next();
      }

      const tenantId = (req as any).tenantId || (req as any).user?.tenantId || 'global';
      const cleanKey = idempotencyKey.trim();
      const bodyHash = IdempotencyService.hashPayload(req.body);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + ttlHours * 60 * 60 * 1000);

      try {
        // 1. Check if key already exists in PostgreSQL
        const existing = await db
          .select()
          .from(idempotencyKeys)
          .where(
            and(
              eq(idempotencyKeys.tenantId, tenantId),
              eq(idempotencyKeys.key, cleanKey),
              gt(idempotencyKeys.expiresAt, now)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          const record = existing[0];

          // If payload hash differs from original request, reject as payload mismatch
          if (record.requestBodyHash && record.requestBodyHash !== bodyHash) {
            return res.status(422).json({
              error: 'IdempotencyPayloadMismatch',
              message: 'تم إرسال مفتاح تطابق مسبقاً مع حمولة طلب مختلفة (Idempotency Key Payload Conflict)'
            });
          }

          // If the previous request is still actively processing
          if (record.status === 'processing') {
            return res.status(409).json({
              error: 'ConcurrentRequestInProgress',
              message: 'يوجد طلب مماثل قيد المعالجة حالياً. يرجى الانتظار وتجنب الإرسال المزدوج (Concurrent Request Locked)'
            });
          }

          // If completed, replay the stored response seamlessly
          if (record.status === 'completed' && record.responseStatus) {
            res.setHeader('X-Cache-Lookup', 'HIT-IDEMPOTENT');
            res.setHeader('X-Idempotent-Replay', 'true');
            if (record.responseHeaders && typeof record.responseHeaders === 'object') {
              for (const [headerKey, headerVal] of Object.entries(record.responseHeaders)) {
                if (headerKey.toLowerCase() !== 'transfer-encoding') {
                  res.setHeader(headerKey, String(headerVal));
                }
              }
            }
            return res.status(record.responseStatus).json(record.responseBody);
          }
        }

        // 2. Insert new idempotency lock into PostgreSQL
        const lockId = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        await db
          .insert(idempotencyKeys)
          .values({
            id: lockId,
            tenantId,
            key: cleanKey,
            requestMethod: req.method,
            requestPath: req.originalUrl || req.url,
            requestBodyHash: bodyHash,
            status: 'processing',
            lockedAt: now,
            createdAt: now,
            expiresAt
          })
          .onConflictDoUpdate({
            target: [idempotencyKeys.tenantId, idempotencyKeys.key],
            set: {
              status: 'processing',
              requestBodyHash: bodyHash,
              lockedAt: now,
              expiresAt
            }
          });

        // 3. Intercept res.send / res.json to capture response and persist in PostgreSQL
        const originalJson = res.json.bind(res);
        res.json = (body: any): Response => {
          // Persist completed response in PostgreSQL asynchronously
          db.update(idempotencyKeys)
            .set({
              status: res.statusCode >= 400 && res.statusCode !== 422 ? 'failed' : 'completed',
              responseStatus: res.statusCode,
              responseBody: body,
              responseHeaders: {
                'content-type': 'application/json'
              }
            })
            .where(
              and(
                eq(idempotencyKeys.tenantId, tenantId),
                eq(idempotencyKeys.key, cleanKey)
              )
            )
            .catch(err => {
              console.error('[IdempotencyService] Failed to update idempotency record:', err);
            });

          return originalJson(body);
        };

        next();
      } catch (err) {
        console.error('[IdempotencyService] Error managing idempotency in DB:', err);
        // Fallback: don't block the request if idempotency storage had a transient issue
        next();
      }
    };
  }
}
