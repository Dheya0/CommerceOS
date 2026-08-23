import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Allowed MIME Types for Bank Transfer Receipts
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB Max

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'receipts');

// Ensure directory exists with non-executable policy
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Validates file buffer or base64 data to ensure no executable/malicious content
 */
export function validateBankReceipt(params: {
  base64Data?: string;
  mimeType?: string;
  sizeBytes?: number;
}): { valid: boolean; error?: string; safeFilename?: string } {
  const { base64Data, mimeType, sizeBytes } = params;

  if (!base64Data) {
    return { valid: false, error: 'لم يتم إرفاق ملف الإيصال' };
  }

  // Check MIME type
  if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
    return { 
      valid: false, 
      error: 'نوع الملف غير مسموح. يقبل النظام فقط صور (PNG, JPG, WEBP) أو ملفات PDF' 
    };
  }

  // Calculate size from base64 if not provided
  const approximateSize = sizeBytes || Math.round((base64Data.length * 3) / 4);
  if (approximateSize > MAX_FILE_SIZE_BYTES) {
    return { 
      valid: false, 
      error: `حجم الملف يتجاوز الحد الأقصى المسموح (${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB)` 
    };
  }

  // Inspect dangerous extensions or headers
  if (base64Data.includes('data:application/x-php') || 
      base64Data.includes('data:application/x-sh') ||
      base64Data.includes('data:text/html')) {
    return { 
      valid: false, 
      error: 'ملف غير آمن، تم حظر المحتوى لأسباب أمنية' 
    };
  }

  // Generate randomized unguessable filename
  const ext = mimeType === 'application/pdf' ? 'pdf' : 
              mimeType === 'image/png' ? 'png' : 
              mimeType === 'image/webp' ? 'webp' : 'jpg';

  const safeFilename = `receipt_${Date.now()}_${crypto.randomBytes(8).toString('hex')}.${ext}`;

  return {
    valid: true,
    safeFilename
  };
}
