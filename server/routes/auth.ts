import { Router, Request, Response } from 'express';
import { db } from '../db';
import { ROLE_PERMISSIONS } from '../middleware/auth';
import { StaffRole } from '../../src/types';

export const authRouter = Router();

// POST /api/v1/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password, role = 'store_owner' } = req.body;
  const tenantId = req.tenantId || 'tenant-royal-honey';

  const validRole = (role in ROLE_PERMISSIONS ? role : 'store_owner') as StaffRole;
  const token = `role:${validRole}:${Date.now()}`;

  const user = {
    id: `user-${Date.now()}`,
    email: email || 'owner@commerceos.app',
    name: validRole === 'store_owner' ? 'مالك المتجر' : 'مسؤول النظام',
    role: validRole,
    tenantId,
    permissions: ROLE_PERMISSIONS[validRole],
    token
  };

  res.json({
    success: true,
    user,
    token
  });
});

// GET /api/v1/auth/me
authRouter.get('/me', (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  res.json({
    user: req.user
  });
});

// POST /api/v1/auth/switch-role (For Live Multi-Role Simulation)
authRouter.post('/switch-role', (req: Request, res: Response) => {
  const { role } = req.body;
  if (!role || !ROLE_PERMISSIONS[role as StaffRole]) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const staffRole = role as StaffRole;
  const token = `role:${staffRole}:${Date.now()}`;

  res.json({
    success: true,
    role: staffRole,
    permissions: ROLE_PERMISSIONS[staffRole],
    token
  });
});
