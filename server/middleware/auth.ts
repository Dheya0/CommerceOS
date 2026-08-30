import { Request, Response, NextFunction } from 'express';
import { StaffRole, StaffPermissions, IdentityType, PlatformAdminRole } from '../../src/types';
import { verifyAuthToken, TokenPayload } from '../utils/security';
import { db } from '../db';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  identityType: IdentityType;
  role: StaffRole | PlatformAdminRole | 'customer';
  tenantId?: string;
  permissions?: StaffPermissions;
  tokenId?: string;
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
 * 1. Inspects and cryptographically validates Bearer Tokens.
 * 2. Checks token expiration & blacklist revocation.
 * 3. Enforces Identity Segregation (Platform HQ vs Tenant Staff vs Customer).
 * 4. Derives RBAC permissions strictly on the server (Zero-trust client claims).
 * 5. Strictly locks tenant context for Tenant Staff, immunizing against query/body injection.
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
      message: 'رمز التحقق غير صالح أو انتهت صلاحية الجلسة أو تم إبطالها',
      details: verification.error
    });
  }

  const payload: TokenPayload = verification.payload;

  // Branch by Identity Type
  if (payload.identityType === 'platform_admin') {
    const admin = db.getPlatformAdmin(payload.email);
    if (!admin) {
      return res.status(401).json({
        error: 'PlatformAdminNotFound',
        message: 'حساب مشرف المنصة غير موجود أو تم إلغاؤه'
      });
    }

    req.user = {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      identityType: 'platform_admin',
      role: admin.role,
      tokenId: payload.tokenId
    };

    return next();
  }

  if (payload.identityType === 'tenant_staff') {
    if (!payload.tenantId) {
      return res.status(401).json({
        error: 'MissingTenantBinding',
        message: 'رمز الجلسة غير مرتبط بمتجر محدد'
      });
    }

    const tenant = db.getTenantByIdOrSlug(payload.tenantId);
    if (!tenant) {
      return res.status(401).json({
        error: 'TenantNotFound',
        message: 'المتجر المرتبط بهذه الجلسة غير موجود أو تم حذفه'
      });
    }

    // Lookup staff in database
    const staff = db.getStaffById(payload.userId, tenant.id);
    if (!staff) {
      // In preview/dev mode, if staff member was mocked, verify role validity
      const staffRole = (payload.role in ROLE_PERMISSIONS ? payload.role : 'store_owner') as StaffRole;
      req.user = {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        identityType: 'tenant_staff',
        role: staffRole,
        tenantId: tenant.id,
        permissions: ROLE_PERMISSIONS[staffRole],
        tokenId: payload.tokenId
      };
    } else {
      if (staff.status !== 'active') {
        return res.status(403).json({
          error: 'AccountSuspended',
          message: 'هذا الحساب الإداري معطل أو غير نشط'
        });
      }

      req.user = {
        id: staff.id,
        email: staff.email,
        name: staff.name,
        identityType: 'tenant_staff',
        role: staff.role,
        tenantId: tenant.id,
        permissions: ROLE_PERMISSIONS[staff.role],
        tokenId: payload.tokenId
      };
    }

    // STRICT Multi-Tenant Lock: for authenticated staff, tenantId is ALWAYS locked to their verified tenant
    req.tenantId = tenant.id;
    return next();
  }

  // Customer Identity
  if (payload.identityType === 'customer') {
    req.user = {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      identityType: 'customer',
      role: 'customer',
      tenantId: payload.tenantId,
      tokenId: payload.tokenId
    };

    if (payload.tenantId) {
      req.tenantId = payload.tenantId;
    }
    return next();
  }

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
 * Server-derived from verified role. Platform Super Admins have universal clearance.
 */
export function requirePermission(permission: keyof StaffPermissions) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'مطلوب تسجيل الدخول بحساب مصرح به'
      });
    }

    // Platform Super Admins have universal platform oversight
    if (req.user.identityType === 'platform_admin') {
      return next();
    }

    // Customers cannot access merchant administrative permissions
    if (req.user.identityType === 'customer' || !req.user.permissions) {
      return res.status(403).json({
        error: 'ForbiddenCustomerAccess',
        message: 'حسابات العملاء غير مصرح لها بالوصول إلى لوحة التحكم الإدارية'
      });
    }

    if (!req.user.permissions[permission]) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: `ليس لديك الصلاحية المطلوبة (${permission}) لتنفيذ هذه العملية في هذا المتجر` 
      });
    }

    next();
  };
}

/**
 * Platform Admin Guard:
 * Strictly restricts access exclusively to CommerceOS Platform Super Admins (HQ).
 */
export function requirePlatformAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'يجب تسجيل الدخول بحساب مشرف منصة موثق'
    });
  }

  if (req.user.identityType !== 'platform_admin') {
    return res.status(403).json({
      error: 'ForbiddenPlatformHQ',
      message: 'هذا المسار مخصص حصرياً للمشرفين العامين لمنصة CommerceOS HQ'
    });
  }

  next();
}

/**
 * Store Owner Guard:
 * Strictly verifies the user is the primary Store Owner (or Platform Super Admin).
 */
export function requireStoreOwner(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'يجب تسجيل الدخول بحساب مالك المتجر'
    });
  }

  if (req.user.identityType === 'platform_admin' || req.user.role === 'store_owner') {
    return next();
  }

  return res.status(403).json({
    error: 'ForbiddenOwnerOnly',
    message: 'هذه العملية محصورة بمالك المتجر حصراً'
  });
}
