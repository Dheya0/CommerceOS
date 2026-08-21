import crypto from 'crypto';
import { StaffRole, StaffPermissions } from '../../src/types';
import { ROLE_PERMISSIONS } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'commerceos_enterprise_super_secret_signing_key_2026';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: StaffRole;
  tenantId: string;
  permissions: StaffPermissions;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Signs a cryptographic session token with HMAC-SHA256
 */
export function signAuthToken(payload: Omit<TokenPayload, 'issuedAt' | 'expiresAt'>, expiresInMs: number = 7 * 24 * 60 * 60 * 1000): string {
  const now = Date.now();
  const fullPayload: TokenPayload = {
    ...payload,
    issuedAt: now,
    expiresAt: now + expiresInMs
  };

  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `cos.${encodedPayload}.${signature}`;
}

/**
 * Verifies and decodes a cryptographic session token
 */
export function verifyAuthToken(token: string): { valid: boolean; payload?: TokenPayload; error?: string } {
  if (!token || !token.startsWith('cos.')) {
    return { valid: false, error: 'Malformed token structure' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Invalid token segment count' };
  }

  const [, encodedPayload, signature] = parts;

  // Verify HMAC signature
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  const isValidSig = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  if (!isValidSig) {
    return { valid: false, error: 'Cryptographic signature mismatch (tampering detected)' };
  }

  try {
    const payloadJson = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const payload: TokenPayload = JSON.parse(payloadJson);

    // Check expiration
    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: 'Session token expired' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: 'Failed to decode payload' };
  }
}
