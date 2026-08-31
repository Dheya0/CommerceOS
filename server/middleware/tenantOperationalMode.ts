import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, ServiceUnavailableError } from '../domain/errors.ts';

export type OperationalMode = 'NORMAL' | 'READ_ONLY' | 'CHECKOUT_DISABLED' | 'SUSPENDED' | 'MAINTENANCE';

// In-memory or tenant settings cache for operational modes
const tenantOperationalModes = new Map<string, OperationalMode>();
let platformMaintenanceMode = false;

export class OperationalControls {
  public static setTenantMode(tenantId: string, mode: OperationalMode): void {
    tenantOperationalModes.set(tenantId, mode);
  }

  public static getTenantMode(tenantId?: string): OperationalMode {
    if (!tenantId) return 'NORMAL';
    return tenantOperationalModes.get(tenantId) || 'NORMAL';
  }

  public static setPlatformMaintenance(active: boolean): void {
    platformMaintenanceMode = active;
  }

  public static isPlatformMaintenance(): boolean {
    return platformMaintenanceMode;
  }
}

export function tenantOperationalModeMiddleware(req: Request, _res: Response, next: NextFunction): void {
  // Skip public health endpoints
  if (req.path.includes('/health') || req.path.includes('/ready') || req.path === '/healthz' || req.path === '/readyz') {
    return next();
  }

  // 1. Platform Maintenance check
  if (OperationalControls.isPlatformMaintenance()) {
    throw new ServiceUnavailableError('المنصة تخضع حالياً لأعمال الصيانة المجدولة، يرجى المحاولة بعد قليل');
  }

  const tenantId = req.tenantId || req.tenant?.id;
  if (!tenantId) {
    return next();
  }

  const mode = OperationalControls.getTenantMode(tenantId);

  // 2. Tenant Suspended
  if (mode === 'SUSPENDED') {
    throw new ForbiddenError('تم تعليق هذا المتجر مؤقتاً من قبل إدارة المنصة');
  }

  // 3. Tenant Maintenance
  if (mode === 'MAINTENANCE') {
    throw new ServiceUnavailableError('المتجر يخضع للصيانة والتحديث حالياً، سنعود قريباً');
  }

  // 4. Read-Only Mode (Blocks all state-modifying requests)
  if (mode === 'READ_ONLY' && req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
    throw new ForbiddenError('المتجر في وضع القراءة فقط (Read-Only Mode)، لا يمكن تعديل البيانات حالياً');
  }

  // 5. Checkout Disabled Mode
  if (mode === 'CHECKOUT_DISABLED') {
    if (req.path.startsWith('/api/v1/orders') && req.method === 'POST') {
      throw new ServiceUnavailableError('تم إيقاف استقبال الطلبات الجديدة مؤقتاً لهذا المتجر');
    }
    if (req.path.startsWith('/api/v1/payments') && req.method === 'POST') {
      throw new ServiceUnavailableError('تم إيقاف بوابات الدفع مؤقتاً لهذا المتجر');
    }
  }

  next();
}
