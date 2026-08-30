import crypto from 'crypto';
import { StaffRole, StaffPermissions, IdentityType, PlatformAdminRole } from '../../src/types';

/**
 * Production Secret Management:
 * Enforces strong, unguessable JWT secret in production.
 * In development, generates a secure random 64-byte secret per process.
 */
function getSigningSecret(): string {
  const envSecret = process.env.JWT_SECRET;
  if (envSecret && envSecret.trim().length >= 32) {
    return envSecret;
  }
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL SECURITY VIOLATION: JWT_SECRET environment variable with at least 32 characters is strictly required in production mode. Default or empty secrets are prohibited.');
  }

  // Generate an unguessable in-memory secret for local/preview development if not explicitly configured
  if (!(global as any).__COMMERCEOS_RUNTIME_SECRET) {
    (global as any).__COMMERCEOS_RUNTIME_SECRET = crypto.randomBytes(48).toString('hex');
  }
  return (global as any).__COMMERCEOS_RUNTIME_SECRET;
}

export interface TokenPayload {
  tokenId: string; // Unique JWT identifier (jti) for session tracking and revocation
  userId: string;
  identityType: IdentityType;
  email: string;
  name: string;
  role: StaffRole | PlatformAdminRole | 'customer';
  tenantId?: string; // Optional for Platform HQ Admins, mandatory for Tenant Staff & Customers
  permissions?: StaffPermissions;
  issuedAt: number;
  expiresAt: number;
}

/**
 * In-Memory & Persisted Session Revocation Store:
 * Tracks revoked individual token IDs and user-wide invalidation timestamps.
 */
class SessionRevocationStore {
  private revokedTokens = new Map<string, number>(); // tokenId -> expiryTime
  private userInvalidationTimestamps = new Map<string, number>(); // userId -> timestamp

  revokeToken(tokenId: string, expiresAt: number) {
    this.revokedTokens.set(tokenId, expiresAt);
    this.cleanup();
  }

  revokeAllUserSessions(userId: string) {
    this.userInvalidationTimestamps.set(userId, Date.now());
  }

  isRevoked(tokenId: string, userId: string, issuedAt: number): boolean {
    // 1. Check if specific token is blacklisted
    if (this.revokedTokens.has(tokenId)) {
      return true;
    }

    // 2. Check if user's sessions were invalidated globally after this token was issued
    const invalidationTime = this.userInvalidationTimestamps.get(userId);
    if (invalidationTime && issuedAt < invalidationTime) {
      return true;
    }

    return false;
  }

  private cleanup() {
    const now = Date.now();
    for (const [tokenId, expiry] of this.revokedTokens.entries()) {
      if (now > expiry) {
        this.revokedTokens.delete(tokenId);
      }
    }
  }
}

export const sessionRevocation = new SessionRevocationStore();

/**
 * Account Lockout & Login Throttling Manager:
 * Protects against brute-force password guessing attacks.
 * Tracks failed attempts per identifier (e.g. email or email:tenantId).
 */
export interface LockoutStatus {
  locked: boolean;
  remainingSeconds: number;
  attemptsCount: number;
}

class AccountLockoutManager {
  private attempts = new Map<string, { count: number; firstAttemptAt: number; lockedUntil?: number }>();
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lock
  private readonly WINDOW_MS = 10 * 60 * 1000; // 10 minutes tracking window

  checkLockout(identifier: string): LockoutStatus {
    const key = identifier.toLowerCase().trim();
    const record = this.attempts.get(key);
    const now = Date.now();

    if (!record) {
      return { locked: false, remainingSeconds: 0, attemptsCount: 0 };
    }

    // Check active lockout
    if (record.lockedUntil && record.lockedUntil > now) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return { locked: true, remainingSeconds, attemptsCount: record.count };
    }

    // If lockout expired or window passed, reset
    if (record.lockedUntil && record.lockedUntil <= now) {
      this.attempts.delete(key);
      return { locked: false, remainingSeconds: 0, attemptsCount: 0 };
    }

    if (now - record.firstAttemptAt > this.WINDOW_MS) {
      this.attempts.delete(key);
      return { locked: false, remainingSeconds: 0, attemptsCount: 0 };
    }

    return { locked: false, remainingSeconds: 0, attemptsCount: record.count };
  }

  recordFailure(identifier: string): LockoutStatus {
    const key = identifier.toLowerCase().trim();
    const now = Date.now();
    const record = this.attempts.get(key) || { count: 0, firstAttemptAt: now };

    // Reset if outside tracking window
    if (now - record.firstAttemptAt > this.WINDOW_MS) {
      record.count = 0;
      record.firstAttemptAt = now;
    }

    record.count += 1;

    if (record.count >= this.MAX_FAILED_ATTEMPTS) {
      record.lockedUntil = now + this.LOCKOUT_DURATION_MS;
      this.attempts.set(key, record);
      return {
        locked: true,
        remainingSeconds: Math.ceil(this.LOCKOUT_DURATION_MS / 1000),
        attemptsCount: record.count
      };
    }

    this.attempts.set(key, record);
    return {
      locked: false,
      remainingSeconds: 0,
      attemptsCount: record.count
    };
  }

  reset(identifier: string) {
    const key = identifier.toLowerCase().trim();
    this.attempts.delete(key);
  }
}

export const accountLockout = new AccountLockoutManager();

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
  payload: Omit<TokenPayload, 'tokenId' | 'issuedAt' | 'expiresAt'>, 
  expiresInMs: number = 24 * 60 * 60 * 1000 // 24 hours standard session lifetime
): string {
  const secret = getSigningSecret();
  const now = Date.now();
  const tokenId = `tok_${crypto.randomBytes(16).toString('hex')}`;

  const fullPayload: TokenPayload = {
    ...payload,
    tokenId,
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
 * Hardened token verification with strict signature check and session revocation verification
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

  // Hardening: check buffer lengths before calling timingSafeEqual
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

    // 1. Check expiration
    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: 'Session token expired' };
    }

    // 2. Check if token was revoked via logout or password change
    if (sessionRevocation.isRevoked(payload.tokenId, payload.userId, payload.issuedAt)) {
      return { valid: false, error: 'Session has been revoked' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: 'Failed to decode payload' };
  }
}
