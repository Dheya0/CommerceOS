import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requirePermission, ROLE_PERMISSIONS } from '../middleware/auth';
import { StaffMember, StaffRole } from '../../src/types';

export const staffRouter = Router();

// GET /api/v1/staff
staffRouter.get('/', (req: Request, res: Response) => {
  const tenantId = (req.query.tenantId as string) || req.tenantId;
  const staff = db.getStaff(tenantId);
  res.json({ staff });
});

// POST /api/v1/staff - Invite/Add staff member
staffRouter.post('/', requirePermission('staff'), (req: Request, res: Response) => {
  const tenantId = req.body.tenantId || req.tenantId;
  const { name, email, role = 'support_agent' } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const validRole = (role in ROLE_PERMISSIONS ? role : 'support_agent') as StaffRole;
  const id = `staff-${Date.now()}`;
  const newStaff: StaffMember = {
    id,
    tenantId,
    name,
    email,
    role: validRole,
    permissions: ROLE_PERMISSIONS[validRole],
    status: 'active',
    avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`,
    createdAt: new Date().toISOString().split('T')[0]
  };

  const created = db.createStaff(newStaff);
  res.status(201).json({
    success: true,
    staff: created
  });
});

// PUT /api/v1/staff/:id - Update staff role / status
staffRouter.put('/:id', requirePermission('staff'), (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  if (updates.role && ROLE_PERMISSIONS[updates.role as StaffRole]) {
    updates.permissions = ROLE_PERMISSIONS[updates.role as StaffRole];
  }

  const updated = db.updateStaff(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Staff member not found' });
  }

  res.json({
    success: true,
    staff: updated
  });
});

// DELETE /api/v1/staff/:id
staffRouter.delete('/:id', requirePermission('staff'), (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteStaff(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Staff member not found' });
  }

  res.json({
    success: true,
    message: 'تم إزالة عضو الفريق بنجاح'
  });
});
