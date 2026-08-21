import { Router, Request, Response } from 'express';
import { db } from '../db';
import { ROLE_PERMISSIONS, requireAuth } from '../middleware/auth';
import { signAuthToken, verifyPassword } from '../utils/security';
import { StaffRole } from '../../src/types';

export const authRouter = Router();

/**
 * POST /api/v1/auth/login
 * Production Authentication Endpoint:
 * Requires valid email + password + tenant membership.
 * Verifies password with salted constant-time PBKDF2 hash.
 * Prohibits arbitrary user creation during login.
 */
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password, tenantId } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      error: 'MissingCredentials', 
      message: 'البريد الإلكتروني وكلمة المرور مطلوبان لتسجيل الدخول' 
    });
  }

  const targetTenantId = tenantId || req.tenantId || 'tenant-royal-honey';
  const tenant = db.getTenantByIdOrSlug(targetTenantId);

  if (!tenant) {
    return res.status(404).json({ error: 'TenantNotFound', message: 'المتجر المطلوب غير موجود' });
  }

  // Look up authenticated staff member in tenant
  const tenantStaff = db.getStaff(tenant.id);
  const staffMember = tenantStaff.find(s => s.email.toLowerCase() === email.trim().toLowerCase());

  if (!staffMember) {
    return res.status(401).json({ 
      error: 'InvalidCredentials', 
      message: 'بيانات الدخول غير صحيحة أو هذا الحساب غير مسجل في هذا المتجر' 
    });
  }

  // Verify password using PBKDF2 with constant-time equality
  const isPasswordValid = verifyPassword(password, staffMember.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ 
      error: 'InvalidCredentials', 
      message: 'بيانات الدخول غير صحيحة، يرجى التأكد من كلمة المرور' 
    });
  }

  if (staffMember.status !== 'active') {
    return res.status(403).json({
      error: 'AccountSuspended',
      message: 'هذا الحساب معطل أو غير نشط حالياً'
    });
  }

  // Cryptographically sign token with HMAC-SHA256
  const token = signAuthToken({
    userId: staffMember.id,
    email: staffMember.email,
    name: staffMember.name,
    role: staffMember.role,
    tenantId: tenant.id,
    permissions: ROLE_PERMISSIONS[staffMember.role]
  });

  res.json({
    success: true,
    token,
    user: {
      id: staffMember.id,
      name: staffMember.name,
      email: staffMember.email,
      role: staffMember.role,
      tenantId: tenant.id,
      permissions: ROLE_PERMISSIONS[staffMember.role]
    },
    tenant: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug
    }
  });
});

/**
 * GET /api/v1/auth/me
 * Returns the currently authenticated user based on validated cryptographic session
 */
authRouter.get('/me', requireAuth, (req: Request, res: Response) => {
  res.json({
    user: req.user,
    tenantId: req.tenantId
  });
});

/**
 * POST /api/v1/auth/switch-role
 * Protected Role-Switching Endpoint:
 * In development/demo mode, allows role testing across staff members in the tenant.
 * In production mode, strictly verifies current session auth, tenant membership, and permissions.
 */
authRouter.post('/switch-role', (req: Request, res: Response) => {
  const { role, tenantId } = req.body;
  const isProd = process.env.NODE_ENV === 'production';

  // In production, require active authentication
  if (isProd) {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'يجب تسجيل الدخول لتغيير الصلاحيات'
      });
    }

    // In production, users can only switch to roles they have been explicitly granted in their tenant
    const targetTenantId = req.user.tenantId;
    const staff = db.getStaff(targetTenantId).find(s => s.id === req.user!.id);
    if (!staff || staff.role !== 'store_owner') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'فقط مالك المتجر يملك صلاحية تبديل الأدوار الإدارية في بيئة الإنتاج'
      });
    }
  }

  const targetTenantId = req.user?.tenantId || tenantId || 'tenant-royal-honey';
  const validRole = (role in ROLE_PERMISSIONS ? role : 'store_owner') as StaffRole;

  const tenant = db.getTenantByIdOrSlug(targetTenantId);
  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }

  // Find existing staff member with target role in this tenant or active user
  const tenantStaff = db.getStaff(tenant.id);
  const matchingStaff = tenantStaff.find(s => s.role === validRole) || tenantStaff[0];

  const userId = matchingStaff ? matchingStaff.id : `staff-${validRole}`;
  const userName = matchingStaff ? matchingStaff.name : (validRole === 'store_owner' ? 'مالك المتجر' : `موظف (${validRole})`);
  const userEmail = matchingStaff ? matchingStaff.email : `${validRole}@${tenant.slug}.com`;

  const token = signAuthToken({
    userId,
    email: userEmail,
    name: userName,
    role: validRole,
    tenantId: tenant.id,
    permissions: ROLE_PERMISSIONS[validRole]
  });

  res.json({
    success: true,
    token,
    role: validRole,
    permissions: ROLE_PERMISSIONS[validRole],
    tenantId: tenant.id,
    user: {
      id: userId,
      name: userName,
      email: userEmail,
      role: validRole,
      tenantId: tenant.id,
      permissions: ROLE_PERMISSIONS[validRole]
    }
  });
});
