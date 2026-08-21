import { Request, Response, NextFunction } from 'express';
import { StaffRole, StaffPermissions } from '../../src/types';
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
 * Authentication Middleware:
 * Inspects `Authorization: Bearer <token>` or `x-staff-role` & `x-user-id` headers
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const staffRoleHeader = (req.headers['x-staff-role'] as StaffRole) || 'store_owner';
  const tenantId = req.tenantId || 'tenant-royal-honey';

  // Support token format: "Bearer role:store_owner:user-123" or standard role
  let role: StaffRole = 'store_owner';
  let userId = 'user-owner-1';
  let userName = 'مالك المتجر';
  let userEmail = 'owner@commerceos.app';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token.startsWith('role:')) {
      const parts = token.split(':');
      if (parts[1] && ROLE_PERMISSIONS[parts[1] as StaffRole]) {
        role = parts[1] as StaffRole;
      }
      if (parts[2]) {
        userId = parts[2];
      }
    }
  } else if (staffRoleHeader && ROLE_PERMISSIONS[staffRoleHeader]) {
    role = staffRoleHeader;
  }

  // Look up matching staff in database if available
  const staffList = db.getStaff(tenantId);
  const matched = staffList.find(s => s.role === role || s.id === userId);
  if (matched) {
    userName = matched.name;
    userEmail = matched.email;
  }

  req.user = {
    id: userId,
    email: userEmail,
    name: userName,
    role,
    tenantId,
    permissions: ROLE_PERMISSIONS[role]
  };

  next();
}

/**
 * RBAC Permission Guard Middleware
 */
export function requirePermission(permission: keyof StaffPermissions) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'مطلوب تسجيل الدخول للوصول' });
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
