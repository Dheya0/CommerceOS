import { Request, Response, NextFunction } from 'express';
import { StaffRole, StaffPermissions } from '../../src/types';
import { verifyAuthToken, signAuthToken, TokenPayload } from '../utils/security';
import { db } from '../db';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  tenantId: string;
  permissions: StaffPermissions;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const ROLE_PERMISSIONS: Record<StaffRole, StaffPermissions> = {
  store_owner: {
    products: true,
    orders: true,
    customers: true,
    inventory: true,
    coupons: true,
    theme: true,
    staff: true,
    settings: true,
    reports: true
  },
  store_admin: {
    products: true,
    orders: true,
    customers: true,
    inventory: true,
    coupons: true,
    theme: true,
    staff: false,
    settings: true,
    reports: true
  },
  product_manager: {
    products: true,
    orders: false,
    customers: false,
    inventory: true,
    coupons: true,
    theme: false,
    staff: false,
    settings: false,
    reports: true
  },
  order_manager: {
    products: false,
    orders: true,
    customers: true,
    inventory: false,
    coupons: false,
    theme: false,
    staff: false,
    settings: false,
    reports: true
  },
  inventory_manager: {
    products: true,
    orders: false,
    customers: false,
    inventory: true,
    coupons: false,
    theme: false,
    staff: false,
    settings: false,
    reports: true
  },
  marketing_manager: {
    products: true,
    orders: false,
    customers: true,
    inventory: false,
    coupons: true,
    theme: true,
    staff: false,
    settings: false,
    reports: true
  },
  support_agent: {
    products: false,
    orders: true,
    customers: true,
    inventory: false,
    coupons: false,
    theme: false,
    staff: false,
    settings: false,
    reports: false
  }
};

/**
 * Hardened Authentication Middleware:
 * Inspects cryptographic Bearer Token.
 * Rejects unsigned spoofed roles or manipulated tenant headers.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Unauthenticated request (guest / storefront)
    return next();
  }

  const token = authHeader.substring(7).trim();
  const verification = verifyAuthToken(token);

  if (!verification.valid || !verification.payload) {
    return res.status(401).json({
      error: 'InvalidToken',
      message: 'رمز التحقق غير صالح أو انتهت صلاحية الجلسة',
      details: verification.error
    });
  }

  const payload = verification.payload;

  // Verify tenant and staff in DB
  const staff = db.getStaff(payload.tenantId).find(s => s.id === payload.userId);
  const tenant = db.getTenantByIdOrSlug(payload.tenantId);

  if (!tenant) {
    return res.status(401).json({
      error: 'TenantNotFound',
      message: 'المتجر المرتبط بهذه الجلسة غير موجود أو تم حذفه'
    });
  }

  // Populate authenticated user
  req.user = {
    id: payload.userId,
    email: payload.email,
    name: payload.name,
    role: staff?.role || payload.role,
    tenantId: payload.tenantId,
    permissions: ROLE_PERMISSIONS[staff?.role || payload.role]
  };

  // Enforce Tenant Isolation: For authenticated operations, tenantId is ALWAYS locked to the user's tenant
  req.tenantId = payload.tenantId;

  next();
}

/**
 * Guard: Requires the request to be authenticated with a valid signed token
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'يجب تسجيل الدخول برمز موثق للوصول إلى هذا المسار'
    });
  }
  next();
}

/**
 * RBAC Permission Guard Middleware:
 * Strictly checks that the user has the required permission for their role.
 */
export function requirePermission(permission: keyof StaffPermissions) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'مطلوب تسجيل الدخول بحساب مصرح به'
      });
    }

    if (!req.user.permissions[permission]) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: `ليس لديك الصلاحية المطلوبة (${permission}) لتنفيذ هذه العملية` 
      });
    }

    next();
  };
}
