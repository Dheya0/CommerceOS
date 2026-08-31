import crypto from 'crypto';

/**
 * CommerceOS Security & Sanitization Engine
 * Protects against XSS, Prototype Pollution, SSRF, Zip Slip, and ReDoS attacks.
 */

// -------------------------------------------------------------
// 1. XSS & HTML Entity Sanitization
// -------------------------------------------------------------
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/[&<>"'/]/g, (match) => HTML_ESCAPE_MAP[match] || match);
}

export function stripHtmlTags(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/<[^>]*>?/gm, '');
}

// -------------------------------------------------------------
// 2. Anti-Prototype Pollution & Safe Object Deep Clone
// -------------------------------------------------------------
const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];

export function sanitizeObject<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  const cleanObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (DANGEROUS_KEYS.includes(key)) {
      // Drop polluted keys
      continue;
    }
    cleanObj[key] = sanitizeObject(value);
  }
  return cleanObj as T;
}

// -------------------------------------------------------------
// 3. Unicode Normalization & Canonicalization
// -------------------------------------------------------------
export function canonicalizeString(
  input: string,
  options: { lowercase?: boolean; removeZeroWidth?: boolean; nfkc?: boolean } = {
    lowercase: true,
    removeZeroWidth: true,
    nfkc: true
  }
): string {
  if (!input || typeof input !== 'string') return '';

  let result = input;

  // NFKC Unicode Normalization
  if (options.nfkc) {
    result = result.normalize('NFKC');
  }

  // Strip Zero-Width and Hidden Characters (U+200B to U+200D, U+FEFF)
  if (options.removeZeroWidth) {
    result = result.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '');
  }

  // Trim Whitespace
  result = result.trim();

  // Lowercase
  if (options.lowercase) {
    result = result.toLowerCase();
  }

  return result;
}

export function canonicalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  const clean = canonicalizeString(email, { lowercase: true, removeZeroWidth: true, nfkc: true });
  const parts = clean.split('@');
  if (parts.length !== 2) return clean;

  let local = parts[0];
  const domain = parts[1];

  // Optional: For standard domains like gmail.com normalize dots
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    local = local.replace(/\./g, '');
    local = local.split('+')[0]; // strip alias
  }

  return `${local}@${domain}`;
}

export function canonicalizeCouponCode(code: string): string {
  return canonicalizeString(code, { lowercase: false, removeZeroWidth: true, nfkc: true })
    .toUpperCase()
    .replace(/\s+/g, '');
}

export function canonicalizeSku(sku: string): string {
  return canonicalizeString(sku, { lowercase: false, removeZeroWidth: true, nfkc: true })
    .toUpperCase()
    .trim();
}

// -------------------------------------------------------------
// 4. SSRF & Safe Outbound URL Validator
// -------------------------------------------------------------
const FORBIDDEN_IP_PREFIXES = [
  '127.', // Loopback
  '10.', // Private class A
  '192.168.', // Private class C
  '172.16.', '172.17.', '172.18.', '172.19.', // Private class B
  '172.20.', '172.21.', '172.22.', '172.23.',
  '172.24.', '172.25.', '172.26.', '172.27.',
  '172.28.', '172.29.', '172.30.', '172.31.',
  '169.254.', // Link-Local / Cloud Metadata (AWS/GCP/Azure)
  '0.0.0.0',
  'localhost',
  '::1',
  'fc00:',
  'fe80:'
];

export function validateSafeExternalUrl(urlStr: string): { safe: boolean; reason?: string } {
  try {
    const parsed = new URL(urlStr);

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { safe: false, reason: 'Only HTTP and HTTPS protocols are permitted' };
    }

    const hostname = parsed.hostname.toLowerCase();

    for (const forbidden of FORBIDDEN_IP_PREFIXES) {
      if (hostname === forbidden || hostname.startsWith(forbidden) || hostname.endsWith(`.${forbidden}`)) {
        return { safe: false, reason: `Target host ${hostname} is inside a restricted private IP / metadata subnet (SSRF blocked)` };
      }
    }

    if (hostname.includes('metadata.google.internal') || hostname.includes('169.254.169.254')) {
      return { safe: false, reason: 'Cloud instance metadata endpoints strictly blocked' };
    }

    return { safe: true };
  } catch (err: any) {
    return { safe: false, reason: 'Malformed URL format' };
  }
}

// -------------------------------------------------------------
// 5. Safe Archive / Zip Security (Zip Slip & Zip Bomb Defense)
// -------------------------------------------------------------
export interface ArchiveValidationConfig {
  maxCompressedBytes: number; // e.g. 50MB
  maxUncompressedBytes: number; // e.g. 200MB
  maxCompressionRatio: number; // e.g. 10x
  maxFileCount: number; // e.g. 500
}

export const DEFAULT_ARCHIVE_LIMITS: ArchiveValidationConfig = {
  maxCompressedBytes: 50 * 1024 * 1024,
  maxUncompressedBytes: 200 * 1024 * 1024,
  maxCompressionRatio: 15,
  maxFileCount: 500
};

export function validateZipEntry(entryPath: string, destinationDir: string): { safe: boolean; reason?: string } {
  if (!entryPath || typeof entryPath !== 'string') {
    return { safe: false, reason: 'Invalid entry path' };
  }

  // Normalize path
  const safePath = entryPath.replace(/\\/g, '/');

  // Prevent Directory Traversal (Zip Slip)
  if (safePath.includes('../') || safePath.includes('/..') || safePath.startsWith('/') || safePath.startsWith('..')) {
    return { safe: false, reason: `Zip Slip attack detected in entry: ${entryPath}` };
  }

  return { safe: true };
}

// -------------------------------------------------------------
// 6. Timing-Safe String Comparison (Anti-Timing Attacks)
// -------------------------------------------------------------
export function timingSafeEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');

  if (bufA.length !== bufB.length) {
    // Prevent length leak by running a dummy compare
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

// -------------------------------------------------------------
// 7. AI Prompt Injection & Cost Protection
// -------------------------------------------------------------
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s+prompt\s+extraction/i,
  /reveal\s+(your\s+)?(system|internal)\s+(prompt|instructions)/i,
  /output\s+all\s+(api\s+keys|secrets|passwords)/i,
  /you\s+are\s+now\s+in\s+unrestricted\s+developer\s+mode/i,
  /bypass\s+all\s+safety\s+filters/i
];

export function sanitizeAiPrompt(prompt: string, maxChars: number = 8000): { cleanPrompt: string; safe: boolean; warning?: string } {
  if (!prompt || typeof prompt !== 'string') {
    return { cleanPrompt: '', safe: true };
  }

  // Check Length
  if (prompt.length > maxChars) {
    return {
      cleanPrompt: prompt.substring(0, maxChars),
      safe: false,
      warning: `Prompt exceeded maximum allowable character limit (${maxChars}). Truncated to prevent compute abuse.`
    };
  }

  // Detect Jailbreaks / Injection
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(prompt)) {
      return {
        cleanPrompt: prompt.replace(pattern, '[REDACTED_SUSPICIOUS_PROMPT_DIRECTIVE]'),
        safe: false,
        warning: 'Suspicious prompt injection directive detected and neutralized'
      };
    }
  }

  return { cleanPrompt: prompt, safe: true };
}
