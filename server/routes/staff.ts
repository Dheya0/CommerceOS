import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requirePermission, ROLE_PERMISSIONS } from '../middleware/auth';
import { hashPassword } from '../utils/security';
import { StaffMember, StaffRole } from '../../src/types';

export const staffRouter = Router();

/**
 * GET /api/v1/staff
 * Lists all staff members in the authenticated user's store (Anti-Cross-Tenant)
 */
staffRouter.get('/', requirePermission('staff'), (req: Request, res: Response) => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) {
    return res.status(400).json({ error: 'MissingTenantBinding', message: 'المتجر غير محدد' });
  }

  const staff = db.getStaff(tenantId).map(s => {
    const safe = { ...s };
    delete safe.passwordHash;
    return safe;
  });

  res.json({ staff });
});

/**
 * POST /api/v1/staff
 * Add/Invite staff member to the authenticated user's store
 * 1. Derives tenantId strictly from req.user.tenantId
 * 2. Privilege Escalation Defense: Only store_owner/platform_admin can create another store_owner
 * 3. Server-derived permissions from ROLE_PERMISSIONS
 */
staffRouter.post('/', requirePermission('staff'), (req: Request, res: Response) => {
  const tenantId = req.user!.tenantId;
  if (!tenantId) {
    return res.status(400).json({ error: 'MissingTenantBinding', message: 'المتجر غير محدد' });
  }

  const { name, email, role = 'support_agent', password } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'MissingFields', message: 'الاسم والبريد الإلكتروني مطلوبان' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Check for duplicate email in this tenant
  const existingStaff = db.getStaff(tenantId).find(s => s.email.toLowerCase() === cleanEmail);
  if (existingStaff) {
    return res.status(409).json({ 
      error: 'DuplicateStaffEmail', 
      message: 'عضو بهذا البريد الإلكتروني مسجل بالفعل في هذا المتجر' 
    });
  }

  const validRole = (role in ROLE_PERMISSIONS ? role : 'support_agent') as StaffRole;

  // Anti-Privilege Escalation: Only existing store_owner or platform_admin can create a store_owner
  if (validRole === 'store_owner' && req.user!.role !== 'store_owner' && req.user!.identityType !== 'platform_admin') {
    return res.status(403).json({
      error: 'ForbiddenRoleAssignment',
      message: 'فقط مالك المتجر يملك صلاحية تعيين مالك متجر آخر'
    });
  }

  const id = `staff-${Date.now()}`;
  const defaultPassword = password || 'CommerceOS@2026';
  const passwordHash = hashPassword(defaultPassword);

  const newStaff: StaffMember = {
    id,
    tenantId,
    name: name.trim(),
    email: cleanEmail,
    role: validRole,
    permissions: ROLE_PERMISSIONS[validRole], // Server-derived permissions
    status: 'active',
    avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`,
    createdAt: new Date().toISOString().split('T')[0],
    passwordHash
  };

  const created = db.createStaff(newStaff);
  const safeCreated = { ...created };
  delete safeCreated.passwordHash;

  res.status(201).json({
    success: true,
    staff: safeCreated,
    message: 'تم إضافة عضو الفريق الجديد بنجاح'
  });
});

/**
 * PUT /api/v1/staff/:id
 * Update staff details (Role, Status, Password)
 * IDOR Defense: Strictly ensures target staff belongs to req.user.tenantId
 * Privilege Escalation Defense: Prevents unauthorized role elevations
 */
staffRouter.put('/:id', requirePermission('staff'), (req: Request, res: Response) => {
  const { id } = req.params;
  const tenantId = req.user!.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: 'MissingTenantBinding', message: 'المتجر غير محدد' });
  }

  // 1. IDOR Defense: Fetch target staff strictly within user's tenant
  const targetStaff = db.getStaffById(id, tenantId);
  if (!targetStaff) {
    return res.status(404).json({ 
      error: 'StaffNotFound', 
      message: 'عضو الفريق غير موجود في هذا المتجر' 
    });
  }

  const updates = { ...req.body };

  // Explicitly prevent cross-tenant migration
  delete updates.tenantId;

  // Privilege Escalation Defense: Only store_owner can promote someone to store_owner
  if (updates.role === 'store_owner' && targetStaff.role !== 'store_owner') {
    if (req.user!.role !== 'store_owner' && req.user!.identityType !== 'platform_admin') {
      return res.status(403).json({
        error: 'ForbiddenRolePromotion',
        message: 'فقط مالك المتجر يملك صلاحية ترقية الموظفين إلى رتبة مالك متجر'
      });
    }
  }

  // Prevent non-owners from modifying an existing store_owner
  if (targetStaff.role === 'store_owner' && req.user!.role !== 'store_owner' && req.user!.identityType !== 'platform_admin') {
    return res.status(403).json({
      error: 'ForbiddenOwnerModification',
      message: 'لا تملك الصلاحية لتعديل حساب مالك المتجر'
    });
  }

  if (updates.password) {
    updates.passwordHash = hashPassword(updates.password);
    delete updates.password;
  }

  // Ensure permissions are strictly server-derived
  if (updates.role && ROLE_PERMISSIONS[updates.role as StaffRole]) {
    updates.permissions = ROLE_PERMISSIONS[updates.role as StaffRole];
  }

  const updated = db.updateStaff(id, updates, tenantId);
  if (!updated) {
    return res.status(404).json({ error: 'StaffNotFound', message: 'فشل تعديل عضو الفريق' });
  }

  const safeUpdated = { ...updated };
  delete safeUpdated.passwordHash;

  res.json({
    success: true,
    staff: safeUpdated,
    message: 'تم تحديث بيانات عضو الفريق بنجاح'
  });
});

/**
 * DELETE /api/v1/staff/:id
 * Remove staff member
 * 1. Self-Deletion Protection: User cannot delete their own active account
 * 2. IDOR Defense: Must belong to req.user.tenantId
 * 3. Store Owner Protection: Cannot delete the last store owner
 */
staffRouter.delete('/:id', requirePermission('staff'), (req: Request, res: Response) => {
  const { id } = req.params;
  const tenantId = req.user!.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: 'MissingTenantBinding', message: 'المتجر غير محدد' });
  }

  // 1. Self-deletion protection
  if (req.user!.id === id) {
    return res.status(400).json({
      error: 'CannotDeleteSelf',
      message: 'لا يمكنك حذف حسابك الشخصي المسجل به الدخول حالياً'
    });
  }

  // 2. IDOR verification: Check staff exists in this tenant
  const targetStaff = db.getStaffById(id, tenantId);
  if (!targetStaff) {
    return res.status(404).json({ 
      error: 'StaffNotFound', 
      message: 'عضو الفريق غير موجود في هذا المتجر' 
    });
  }

  // 3. Store Owner protection: check if deleting the only owner
  if (targetStaff.role === 'store_owner') {
    const allOwners = db.getStaff(tenantId).filter(s => s.role === 'store_owner');
    if (allOwners.length <= 1) {
      return res.status(400).json({
        error: 'CannotDeletePrimaryOwner',
        message: 'لا يمكن حذف مالك المتجر الوحيد'
      });
    }
  }

  const deleted = db.deleteStaff(id, tenantId);
  if (!deleted) {
    return res.status(404).json({ error: 'StaffNotFound', message: 'فشل حذف عضو الفريق' });
  }

  res.json({
    success: true,
    message: 'تم إزالة عضو الفريق بنجاح من هذا المتجر'
  });
});
