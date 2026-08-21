import crypto from 'crypto';
import { StaffRole, StaffPermissions } from '../../src/types';

/**
 * Production Secret Management:
 * Retrieves JWT_SECRET or initializes an unguessable runtime key for secure operations.
 */
function getSigningSecret(): string {
  const envSecret = process.env.JWT_SECRET;
  if (envSecret && envSecret.trim().length >= 32) {
    return envSecret;
  }
  
  if (process.env.NODE_ENV === 'production' && !envSecret) {
    throw new Error('FATAL: JWT_SECRET environment variable with at least 32 characters is strictly required in production.');
  }

  // Generate an unguessable in-memory secret for local/preview development if not explicitly configured
  if (!(global as any).__COMMERCEOS_RUNTIME_SECRET) {
    (global as any).__COMMERCEOS_RUNTIME_SECRET = crypto.randomBytes(48).toString('hex');
  }
  return (global as any).__COMMERCEOS_RUNTIME_SECRET;
}

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
 * Secure password hashing using PBKDF2 with unique cryptographic salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha512';
  const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
  return `pbkdf2$${iterations}$${salt}$${derivedKey.toString('hex')}`;
}

/**
 * Constant-time verification of password against stored PBKDF2 hash
 */
export function verifyPassword(password: string, storedHash?: string): boolean {
  if (!storedHash || !storedHash.startsWith('pbkdf2$')) {
    return false;
  }

  const parts = storedHash.split('$');
  if (parts.length !== 4) return false;

  const iterations = parseInt(parts[1], 10);
  const salt = parts[2];
  const originalKeyHex = parts[3];

  if (isNaN(iterations) || !salt || !originalKeyHex) return false;

  const originalKey = Buffer.from(originalKeyHex, 'hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, originalKey.length, 'sha512');

  if (derivedKey.length !== originalKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(derivedKey, originalKey);
}

/**
 * Signs a cryptographic session token with HMAC-SHA256
 */
export function signAuthToken(
  payload: Omit<TokenPayload, 'issuedAt' | 'expiresAt'>, 
  expiresInMs: number = 7 * 24 * 60 * 60 * 1000
): string {
  const secret = getSigningSecret();
  const now = Date.now();
  const fullPayload: TokenPayload = {
    ...payload,
    issuedAt: now,
    expiresAt: now + expiresInMs
  };

  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');

  return `cos.${encodedPayload}.${signature}`;
}

/**
 * Hardened token verification with strict length check before timingSafeEqual
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
  const secret = getSigningSecret();

  // Verify HMAC signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');

  const actualBuf = Buffer.from(signature, 'utf-8');
  const expectedBuf = Buffer.from(expectedSignature, 'utf-8');

  // Hardening: check buffer lengths before calling timingSafeEqual to avoid Node.js buffer length exception
  if (actualBuf.length !== expectedBuf.length) {
    return { valid: false, error: 'Cryptographic signature mismatch (invalid length)' };
  }

  const isValidSig = crypto.timingSafeEqual(actualBuf, expectedBuf);

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
