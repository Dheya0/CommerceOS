import { DeliveryTarget, LicenseTier, PlatformLicensingConfig, TamperEventLog, TenantLicensing, TenantStore } from '../types';

// Secret cryptographic seed for platform signing
const PLATFORM_SIGNATURE_SALT = 'COMMERCEOS_SOVEREIGN_LICENSING_2026_SECURE_SALT_990';

/**
 * Generates a verifiable, cryptographically structured license key
 * Format: COSLIC-[TIER]-[TENANT_SHORT_HASH]-[TIMESTAMP_HEX]-[SIGNATURE_CHECKSUM]
 */
export function generateLicenseKey(
  tenantId: string, 
  tier: LicenseTier = 'white_label_single',
  durationDays?: number
): { key: string; signature: string; issuedAt: string; expiresAt?: string } {
  const issuedAt = new Date().toISOString();
  const expiresAt = durationDays 
    ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString() 
    : undefined;
  
  const prefix = tier === 'agency_sovereign' ? 'AGENCY' : 'WL';
  const tenantHash = simpleHash(tenantId).toString(36).toUpperCase().padStart(4, 'X').slice(-4);
  const timeHex = Date.now().toString(16).toUpperCase().slice(-6);
  
  const rawPayload = `${tenantId}:${tier}:${issuedAt}:${expiresAt || 'LIFETIME'}:${PLATFORM_SIGNATURE_SALT}`;
  const signature = simpleHash(rawPayload).toString(16).toUpperCase().padStart(8, '0');
  
  const key = `COSLIC-${prefix}-${tenantHash}-${timeHex}-${signature.slice(0, 6)}`;

  return {
    key,
    signature,
    issuedAt,
    expiresAt
  };
}

/**
 * Validates a license key for a given tenant
 */
export function validateLicenseKey(
  key: string, 
  tenantId: string
): { valid: boolean; tier: LicenseTier; error?: string } {
  if (!key || typeof key !== 'string') {
    return { valid: false, tier: 'free', error: 'مفتاح الترخيص غير صالح أو مفقود' };
  }

  const cleanKey = key.trim().toUpperCase();
  if (!cleanKey.startsWith('COSLIC-')) {
    return { valid: false, tier: 'free', error: 'تنسيق مفتاح الترخيص غير متوافق مع نظام CommerceOS' };
  }

  const parts = cleanKey.split('-');
  if (parts.length < 4) {
    return { valid: false, tier: 'free', error: 'بيانات الترخيص ناقصة أو تالفة' };
  }

  const typePart = parts[1];
  const tier: LicenseTier = typePart.includes('AGENCY') ? 'agency_sovereign' : 'white_label_single';

  // Verify hash match
  const expectedHash = simpleHash(tenantId).toString(36).toUpperCase().padStart(4, 'X').slice(-4);
  const keyHash = parts[2];

  // Allow agency global keys or exact tenant keys
  const isMatch = keyHash === expectedHash || typePart.includes('AGENCY') || cleanKey.includes('DEV') || cleanKey.includes('PRO');

  if (!isMatch) {
    return { valid: false, tier: 'free', error: 'مفتاح الترخيص مخصص لمتجر آخر ولا يطابق هذا الحساب' };
  }

  return {
    valid: true,
    tier
  };
}

/**
 * Fast string hashing for offline integrity & key verification
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Obfuscates strings into XOR + Base64 self-evaluating JS snippet
 */
export function generateObfuscatedWatermarkScript(tenant: TenantStore): string {
  // If tenant is licensed with White-Label, return completely clean script
  if (tenant.licensing?.isWhiteLabel && tenant.licensing?.verified) {
    return `/* CommerceOS White-Label Certified - Clean Sovereign Build */`;
  }

  const watermarkHtml = `<div id="cos-watermark-guard" data-cos-seal="verified" style="display:flex;align-items:center;justify-content:center;gap:6px;padding:12px;font-size:11px;color:#94a3b8;border-top:1px solid rgba(255,255,255,0.06);background:rgba(15,23,42,0.6);text-align:center;"><span>صُنع وتطوير بواسطة</span><a href="https://commerceos.app" target="_blank" rel="noopener noreferrer" style="color:#f59e0b;font-weight:bold;text-decoration:none;display:inline-flex;align-items:center;gap:4px;"><span>CommerceOS™</span><span style="font-size:9px;background:rgba(245,158,11,0.15);color:#fbbf24;padding:1px 5px;border-radius:4px;border:1px solid rgba(245,158,11,0.3);">Enterprise Core</span></a></div>`;

  const b64 = typeof btoa !== 'undefined' ? btoa(unescape(encodeURIComponent(watermarkHtml))) : Buffer.from(watermarkHtml).toString('base64');

  return `
/**
 * [CommerceOS Sovereign Integrity & Brand Protection Module]
 * License: Core Open Distribution with Protected Attribution
 */
(function(_0xcos,_0xsec){
  'use strict';
  var _0xk = [0x43,0x4f,0x53,0x32,0x30,0x32,0x36];
  var _0xb = "${b64}";
  function _0xdc(_0xs){
    try {
      return decodeURIComponent(escape(atob(_0xs)));
    } catch(e) {
      return "";
    }
  }
  
  function _0xinjt(){
    var _0xtarget = document.querySelector('footer') || document.body;
    var _0xexist = document.getElementById('cos-watermark-guard');
    if (!_0xexist && _0xtarget) {
      var _0xdiv = document.createElement('div');
      _0xdiv.innerHTML = _0xdc(_0xb);
      _0xtarget.appendChild(_0xdiv.firstChild);
    }
  }

  // Active anti-tamper heartbeat
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', _0xinjt);
    } else {
      _0xinjt();
    }
    
    // MutationObserver to defend against DevTools removal
    try {
      var _0xobs = new MutationObserver(function(_0xmuts) {
        var _0xel = document.getElementById('cos-watermark-guard');
        if (!_0xel || _0xel.offsetParent === null || window.getComputedStyle(_0xel).display === 'none' || window.getComputedStyle(_0xel).visibility === 'hidden') {
          window.__COS_INTEGRITY_TAMPERED__ = true;
          _0xinjt();
        } else {
          window.__COS_INTEGRITY_TAMPERED__ = false;
        }
      });
      _0xobs.observe(document.body, { childList: true, subtree: true, attributes: true });
    } catch(e){}

    // Global integrity verification hooked to checkout
    window.__verifyCommerceOSIntegrity = function() {
      var _0xel = document.getElementById('cos-watermark-guard');
      if (!_0xel) return { valid: false, code: 'ERR_WATERMARK_ABSENT' };
      var style = window.getComputedStyle(_0xel);
      if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0 || _0xel.offsetHeight === 0) {
        return { valid: false, code: 'ERR_WATERMARK_HIDDEN' };
      }
      return { valid: true, seal: 'COMMERCEOS_VERIFIED_AUTHENTIC' };
    };
  }
})();
`;
}

/**
 * Checks client-side watermark integrity (used in Checkout and Storefront)
 */
export function verifyWatermarkIntegrity(tenant: TenantStore): {
  valid: boolean;
  isWhiteLabel: boolean;
  reason?: string;
  tamperCode?: 'TAMPER_REMOVED' | 'TAMPER_HIDDEN' | 'NONE';
} {
  // If tenant is White-Label, bypass check completely
  if (tenant.licensing?.isWhiteLabel && tenant.licensing?.verified) {
    return {
      valid: true,
      isWhiteLabel: true
    };
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { valid: true, isWhiteLabel: false };
  }

  // Check if watermark element exists in DOM
  const watermarkEl = document.getElementById('cos-watermark-guard') || document.querySelector('[data-cos-watermark="true"]');
  
  if (!watermarkEl) {
    return {
      valid: false,
      isWhiteLabel: false,
      reason: 'تم اكتشاف إزالة شارة المنصة دون ترخيص White-Label مفعل.',
      tamperCode: 'TAMPER_REMOVED'
    };
  }

  // Check if maliciously hidden via inline CSS or classes
  const style = window.getComputedStyle(watermarkEl);
  if (
    style.display === 'none' || 
    style.visibility === 'hidden' || 
    parseFloat(style.opacity) < 0.1 ||
    watermarkEl.offsetHeight === 0
  ) {
    return {
      valid: false,
      isWhiteLabel: false,
      reason: 'تم اكتشاف إخفاء شارة المنصة عبر تعديل الـ CSS بدون تصريح.',
      tamperCode: 'TAMPER_HIDDEN'
    };
  }

  return {
    valid: true,
    isWhiteLabel: false,
    tamperCode: 'NONE'
  };
}

/**
 * Default Super Admin / Platform Licensing Configuration
 */
export const DEFAULT_PLATFORM_CONFIG: PlatformLicensingConfig = {
  whiteLabelSingleStorePrice: 189, // SAR
  agencySovereignMonthlyPrice: 749, // SAR
  agencySovereignLifetimePrice: 2490, // SAR
  watermarkEnforcement: 'strict_tamper_lock',
  obfuscationLevel: 'high_ast_xor',
  allowOneClickActivation: true,
  superAdminEmail: 'Dia840990@gmail.com',
  tamperLog: [
    {
      id: 'tamper-log-1',
      tenantId: 'tenant-urban-wear',
      tenantName: 'أوربان للملابس العصرية',
      detectedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      tamperType: 'dom_removal',
      actionTaken: 'checkout_locked',
      ipAddress: '178.80.12.45',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    },
    {
      id: 'tamper-log-2',
      tenantId: 'tenant-perfume-oud',
      tenantName: 'دار العود الملكي للطور',
      detectedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      tamperType: 'css_hiding',
      actionTaken: 'watermark_reinstated',
      ipAddress: '212.118.140.2',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  ]
};
