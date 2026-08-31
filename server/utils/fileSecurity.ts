import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Allowed MIME Types for Uploads
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB Max

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'receipts');

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Checks magic byte signatures from buffer to ensure the file isn't masked malware
 */
export function verifyMagicBytes(buffer: Buffer): { valid: boolean; detectedMime?: string } {
  if (!buffer || buffer.length < 4) {
    return { valid: false };
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return { valid: true, detectedMime: 'image/png' };
  }

  // JPEG / JPG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return { valid: true, detectedMime: 'image/jpeg' };
  }

  // PDF: 25 50 44 46 (%PDF)
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return { valid: true, detectedMime: 'application/pdf' };
  }

  // WebP: RIFF ... WEBP (52 49 46 46 .... 57 45 42 50)
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return { valid: true, detectedMime: 'image/webp' };
  }

  return { valid: false };
}

/**
 * Validates file buffer or base64 data to ensure no executable/malicious content
 */
export function validateBankReceipt(params: {
  base64Data?: string;
  buffer?: Buffer;
  mimeType?: string;
  sizeBytes?: number;
}): { valid: boolean; error?: string; safeFilename?: string; verifiedMime?: string } {
  const { base64Data, mimeType, sizeBytes } = params;

  let buffer = params.buffer;
  if (!buffer && base64Data) {
    // Strip data URL prefix if present
    const cleanBase64 = base64Data.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    buffer = Buffer.from(cleanBase64, 'base64');
  }

  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'لم يتم إرفاق ملف الإيصال أو الملف فارغ' };
  }

  // Check file size
  const actualSize = sizeBytes || buffer.length;
  if (actualSize > MAX_FILE_SIZE_BYTES) {
    return { 
      valid: false, 
      error: `حجم الملف يتجاوز الحد الأقصى المسموح (${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB)` 
    };
  }

  // Verify Magic Bytes
  const magicCheck = verifyMagicBytes(buffer);
  if (!magicCheck.valid) {
    return {
      valid: false,
      error: 'نوع الملف غير صالح أو تم تعديل ترويسة الملف (Magic Bytes Check Failed)'
    };
  }

  // Check MIME compatibility
  if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
    return { 
      valid: false, 
      error: 'نوع الملف غير مسموح. يقبل النظام فقط صور (PNG, JPG, WEBP) أو ملفات PDF' 
    };
  }

  const verifiedMime = magicCheck.detectedMime || mimeType || 'image/jpeg';
  const ext = verifiedMime === 'application/pdf' ? 'pdf' : 
              verifiedMime === 'image/png' ? 'png' : 
              verifiedMime === 'image/webp' ? 'webp' : 'jpg';

  const safeFilename = `receipt_${Date.now()}_${crypto.randomBytes(8).toString('hex')}.${ext}`;

  return {
    valid: true,
    safeFilename,
    verifiedMime
  };
}
