import { StaffRole, StaffMember } from '../../src/types.ts';
import { ROLE_PERMISSIONS, AuthenticatedUser } from '../middleware/auth.ts';
import { signAuthToken, verifyPassword, accountLockout, sessionRevocation, hashPassword } from '../utils/security.ts';
import { ValidationError, UnauthorizedError, ForbiddenError, TooManyRequestsError } from '../domain/errors.ts';
import { db } from '../db.ts';

export interface LoginParams {
  email?: string;
  password?: string;
  role?: StaffRole;
  tenantId?: string;
}

export class AuthService {
  /**
   * Register a new user/merchant.
   * Creates a staff member in the database with role 'store_owner' and initially empty tenant.
   */
  public async register(data: { name: string; email: string; password?: string }) {
    const { name, email, password } = data;
    if (!name || !name.trim()) {
      throw new ValidationError('الاسم الكامل مطلوب للتسجيل');
    }
    if (!email || !email.trim()) {
      throw new ValidationError('البريد الإلكتروني مطلوب للتسجيل');
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const allStaff = db.getStaff();
    const existing = allStaff.find(s => s.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new ValidationError('البريد الإلكتروني مسجل مسبقاً في النظام');
    }

    const id = `staff-${Date.now()}`;
    const passwordHash = password ? hashPassword(password) : '';

    const newStaff: StaffMember = {
      id,
      tenantId: '', // Empty initially - no default store
      name: name.trim(),
      email: cleanEmail,
      role: 'store_owner',
      permissions: ROLE_PERMISSIONS['store_owner'],
      status: 'active',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString().split('T')[0],
      passwordHash
    };

    db.createStaff(newStaff);

    return {
      success: true,
      user: {
        id,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        tenantId: ''
      }
    };
  }

  /**
   * Server-Side DB-Backed Authentication
   * Validates credentials against salted PBKDF2 hashes in database.
   * Immunized against client role-spoofing and brute-force guessing.
   */
  public async login(params: LoginParams) {
    const { email, password, tenantId } = params;

    if (!email || !email.trim()) {
      throw new ValidationError('البريد الإلكتروني مطلوب لتسجيل الدخول');
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Account Lockout / Brute-force protection
    const lockout = accountLockout.checkLockout(cleanEmail);
    if (lockout.locked) {
      throw new TooManyRequestsError(
        `تم قفل الحساب مؤقتاً بسبب تكرار المحاولات الخاطئة. يرجى المحاولة بعد ${lockout.remainingSeconds} ثانية.`
      );
    }

    // 2. Check Platform Super Admins first
    const admin = db.getPlatformAdmin(cleanEmail);
    if (admin) {
      const isPasswordValid = Boolean(password && verifyPassword(password, admin.passwordHash));

      if (!isPasswordValid) {
        const failureStatus = accountLockout.recordFailure(cleanEmail);
        if (failureStatus.locked) {
          throw new TooManyRequestsError('تم قفل الحساب لتجاوز عدد المحاولات الخاطئة المسموح بها.');
        }
        throw new UnauthorizedError('كلمة المرور أو البريد الإلكتروني غير صحيح');
      }

      accountLockout.reset(cleanEmail);

      const token = signAuthToken({
        userId: admin.id,
        identityType: 'platform_admin',
        email: admin.email,
        name: admin.name,
        role: admin.role
      });

      return {
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          identityType: 'platform_admin'
        },
        token,
        identityType: 'platform_admin',
        permissions: ROLE_PERMISSIONS['store_owner']
      };
    }

    // 3. Check Tenant Staff in the database
    const allStaff = db.getStaff();
    const matchedStaff = allStaff.find(s => 
      s.email.toLowerCase() === cleanEmail && (!tenantId || s.tenantId === tenantId)
    ) || allStaff.find(s => s.email.toLowerCase() === cleanEmail);

    if (matchedStaff) {
      if (matchedStaff.status !== 'active') {
        throw new ForbiddenError('هذا الحساب الإداري معطل أو غير نشط حالياً');
      }

      const isPasswordValid = Boolean(password && verifyPassword(password, matchedStaff.passwordHash));

      if (!isPasswordValid) {
        const failureStatus = accountLockout.recordFailure(cleanEmail);
        if (failureStatus.locked) {
          throw new TooManyRequestsError('تم قفل الحساب لتجاوز عدد المحاولات الخاطئة المسموح بها.');
        }
        throw new UnauthorizedError('كلمة المرور أو البريد الإلكتروني غير صحيح');
      }

      accountLockout.reset(cleanEmail);

      const token = signAuthToken({
        userId: matchedStaff.id,
        identityType: 'tenant_staff',
        email: matchedStaff.email,
        name: matchedStaff.name,
        role: matchedStaff.role,
        tenantId: matchedStaff.tenantId,
        permissions: ROLE_PERMISSIONS[matchedStaff.role]
      });

      return {
        user: {
          id: matchedStaff.id,
          name: matchedStaff.name,
          email: matchedStaff.email,
          role: matchedStaff.role,
          tenantId: matchedStaff.tenantId,
          permissions: ROLE_PERMISSIONS[matchedStaff.role]
        },
        token,
        identityType: 'tenant_staff',
        permissions: ROLE_PERMISSIONS[matchedStaff.role] || []
      };
    }

    // Record failure and throw 401
    accountLockout.recordFailure(cleanEmail);
    throw new UnauthorizedError('كلمة المرور أو البريد الإلكتروني غير صحيح');
  }

  /**
   * Secure Role Switching with strict Authorization
   * Prevents privilege escalation: only permitted if current user is store_owner or platform_admin,
   * or possesses verified database credentials for the target role.
   */
  public async switchRole(targetRole: StaffRole, tenantId: string, currentUser?: AuthenticatedUser) {
    if (!ROLE_PERMISSIONS[targetRole]) {
      throw new ValidationError(`الدور المطلوب (${targetRole}) غير صالح`);
    }

    if (!currentUser) {
      throw new UnauthorizedError('يجب أن تكون مسجل الدخول لتغيير الدور الإداري');
    }

    // Zero-Trust Privilege Escalation Guard:
    // Only Store Owners or Platform Admins can simulate/switch to another role within their tenant
    if (currentUser.identityType !== 'platform_admin' && currentUser.role !== 'store_owner') {
      throw new ForbiddenError('غير مصرح لك بتبديل أو ترقية الدور الإداري دون صلاحيات مالك المتجر');
    }

    const effectiveTenantId = currentUser.tenantId || tenantId;

    const token = signAuthToken({
      userId: currentUser.id,
      identityType: 'tenant_staff',
      email: currentUser.email,
      name: currentUser.name,
      role: targetRole,
      tenantId: effectiveTenantId,
      permissions: ROLE_PERMISSIONS[targetRole]
    });

    return {
      role: targetRole,
      token,
      permissions: ROLE_PERMISSIONS[targetRole]
    };
  }

  /**
   * Invalidate session token upon logout
   */
  public async logout(tokenId?: string, userId?: string, issuedAt?: number) {
    if (tokenId) {
      // Revoke token for 24 hours
      sessionRevocation.revokeToken(tokenId, Date.now() + 24 * 60 * 60 * 1000);
    }
    if (userId) {
      sessionRevocation.revokeAllUserSessions(userId);
    }
    return { success: true };
  }
}

export const authService = new AuthService();

