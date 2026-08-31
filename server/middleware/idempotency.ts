import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db } from '../../src/db/index.ts';
import { idempotencyKeys } from '../../src/db/schema.ts';
import { eq, and, sql } from 'drizzle-orm';
import { ConflictError } from '../domain/errors.ts';

/**
 * Computes a deterministic SHA-256 hash of the request body and query parameters.
 */
export function computeRequestHash(req: Request): string {
  const payloadToHash = {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body || {}
  };
  return crypto.createHash('sha256').update(JSON.stringify(payloadToHash)).digest('hex');
}

/**
 * DATABASE-BACKED IDEMPOTENCY MIDDLEWARE
 * Strictly conforms to RFC 7395 & Phase 1 Specifications:
 * 1. Backed by PostgreSQL `idempotency_keys` table.
 * 2. Compares incoming payload hash to prevent key reuse attacks with mismatched payloads (409 Conflict).
 * 3. Handles in-flight locks with timeout.
 * 4. Replays exact response body & status for duplicate requests.
 */
export async function idempotencyMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only apply to state-mutating HTTP methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const rawKey = req.headers['idempotency-key'] || req.headers['x-idempotency-key'];
  if (!rawKey || typeof rawKey !== 'string' || rawKey.trim() === '') {
    return next();
  }

  const idempotencyKey = rawKey.trim();
  const tenantId = (req as any).tenantId || (req as any).user?.tenantId || 'global';
  const requestPath = req.baseUrl ? `${req.baseUrl}${req.path}` : req.path;
  const requestHash = computeRequestHash(req);

  try {
    // 1. Query existing idempotency record
    const existingRows = await db
      .select()
      .from(idempotencyKeys)
      .where(
        and(
          eq(idempotencyKeys.tenantId, tenantId),
          eq(idempotencyKeys.key, idempotencyKey)
        )
      )
      .limit(1);

    if (existingRows.length > 0) {
      const existing = existingRows[0];

      // Check if key is expired (24h default)
      if (new Date(existing.expiresAt) < new Date()) {
        // Expired, delete and proceed
        await db.delete(idempotencyKeys).where(eq(idempotencyKeys.id, existing.id));
      } else {
        // Check for payload mismatch -> 409 Conflict
        if (existing.requestBodyHash && existing.requestBodyHash !== requestHash) {
          return res.status(409).json({
            success: false,
            error: 'Idempotency key reused with different request payload',
            errorCode: 'IDEMPOTENCY_KEY_PAYLOAD_MISMATCH',
            details: {
              key: idempotencyKey,
              path: requestPath
            }
          });
        }

        // If previously completed, replay the response immediately
        if (existing.status === 'completed' && existing.responseBody) {
          res.setHeader('X-Idempotent-Replay', 'true');
          res.setHeader('X-Idempotency-Key', idempotencyKey);
          return res.status(existing.responseStatus || 200).json(existing.responseBody);
        }

        // If currently in processing
        if (existing.status === 'processing') {
          const lockAgeMs = Date.now() - new Date(existing.lockedAt).getTime();
          if (lockAgeMs < 15000) {
            // Active in-flight processing by another concurrent worker
            return res.status(409).json({
              success: false,
              error: 'A request with this idempotency key is currently processing. Please retry in a few seconds.',
              errorCode: 'IDEMPOTENCY_IN_FLIGHT'
            });
          }
          // Stale lock (> 15s) - allow taking over
        }
      }
    }

    // 2. Reserve / Record the idempotency key in 'processing' status
    const recordId = `idm_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    await db
      .insert(idempotencyKeys)
      .values({
        id: recordId,
        tenantId,
        key: idempotencyKey,
        requestMethod: req.method,
        requestPath,
        requestBodyHash: requestHash,
        status: 'processing',
        lockedAt: now,
        createdAt: now,
        expiresAt
      })
      .onConflictDoUpdate({
        target: [idempotencyKeys.tenantId, idempotencyKeys.key],
        set: {
          requestBodyHash: requestHash,
          status: 'processing',
          lockedAt: now,
          expiresAt
        }
      });

    // 3. Wrap response to capture and commit the final payload
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    let responseCaptured = false;

    res.json = function (body: any) {
      if (!responseCaptured) {
        responseCaptured = true;
        const statusCode = res.statusCode || 200;

        // Async write back to DB in non-blocking manner
        db.update(idempotencyKeys)
          .set({
            status: statusCode >= 200 && statusCode < 400 ? 'completed' : 'failed',
            responseStatus: statusCode,
            responseBody: body,
            responseHeaders: { 'content-type': 'application/json' }
          })
          .where(
            and(
              eq(idempotencyKeys.tenantId, tenantId),
              eq(idempotencyKeys.key, idempotencyKey)
            )
          )
          .catch((err) => {
            console.error('[IdempotencyMiddleware] Failed to commit response payload:', err);
          });
      }
      return originalJson(body);
    };

    next();
  } catch (err: any) {
    console.error('[IdempotencyMiddleware] Error:', err);
    next();
  }
}
