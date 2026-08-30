import { db } from '../db.ts';
import { StaffMember } from '../../src/types.ts';
import { ROLE_PERMISSIONS } from '../middleware/auth.ts';

export class StaffRepository {
  public async findByTenant(tenantId: string): Promise<StaffMember[]> {
    return db.getStaff(tenantId);
  }

  public async findById(id: string, tenantId: string): Promise<StaffMember | undefined> {
    return db.getStaffById(id, tenantId);
  }

  public async create(staff: Partial<StaffMember> & { name: string; email: string; tenantId: string }): Promise<StaffMember> {
    const role = staff.role || 'order_manager';
    const fullStaff: StaffMember = {
      id: staff.id || `staff-${Date.now()}`,
      tenantId: staff.tenantId,
      name: staff.name,
      email: staff.email,
      avatar: staff.avatar,
      role,
      permissions: staff.permissions || ROLE_PERMISSIONS[role],
      status: staff.status || 'active',
      createdAt: staff.createdAt || new Date().toISOString()
    };
    return db.createStaff(fullStaff);
  }

  public async update(id: string, updates: Partial<StaffMember>, tenantId: string): Promise<StaffMember | null> {
    return db.updateStaff(id, updates, tenantId);
  }

  public async delete(id: string, tenantId: string): Promise<boolean> {
    return db.deleteStaff(id, tenantId);
  }
}

export const staffRepository = new StaffRepository();
