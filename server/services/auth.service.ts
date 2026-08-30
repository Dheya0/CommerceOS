import { StaffRole } from '../../src/types.ts';
import { ROLE_PERMISSIONS } from '../middleware/auth.ts';
import { signAuthToken } from '../utils/security.ts';
import { ValidationError } from '../domain/errors.ts';

export interface LoginParams {
  email?: string;
  password?: string;
  role?: StaffRole;
  tenantId: string;
}

export class AuthService {
  public async login(params: LoginParams) {
    const { email, role = 'store_owner', tenantId } = params;

    const user = {
      id: `usr_${role}_${Date.now()}`,
      email: email || `${role}@commerceos.app`,
      name: role === 'store_owner' ? 'مالك المتجر' : 'مسؤول المتجر',
      role,
      tenantId
    };

    const token = signAuthToken({
      userId: user.id,
      identityType: 'tenant_staff',
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      permissions: ROLE_PERMISSIONS[role]
    });

    return {
      user,
      token,
      permissions: ROLE_PERMISSIONS[role] || []
    };
  }

  public async switchRole(role: StaffRole, tenantId: string, currentUserId?: string) {
    if (!ROLE_PERMISSIONS[role]) {
      throw new ValidationError(`الدور (${role}) غير صالح`);
    }

    const user = {
      id: currentUserId || `usr_${role}`,
      name: role === 'store_owner' ? 'مالك المتجر' : 'مسؤول المتجر',
      email: `${role}@commerceos.app`,
      role,
      tenantId
    };

    const token = signAuthToken({
      userId: user.id,
      identityType: 'tenant_staff',
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      permissions: ROLE_PERMISSIONS[role]
    });

    return {
      role,
      token,
      permissions: ROLE_PERMISSIONS[role]
    };
  }
}

export const authService = new AuthService();
