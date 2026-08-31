import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.ts';
import { requireRole } from '../middleware/auth.ts';

export const adminRouter = Router();

// Require store_owner or platform admin role for administrative actions
adminRouter.use(requireRole(['store_owner', 'admin', 'manager']));

adminRouter.post('/reconciliation/run', adminController.runReconciliation);
adminRouter.post('/tenants/:tenantId/mode', adminController.setTenantOperationalMode);
adminRouter.get('/metrics', adminController.getSystemMetrics);
adminRouter.get('/jobs', adminController.getJobs);
adminRouter.post('/jobs/:id/retry', adminController.retryJob);
adminRouter.get('/outbox', adminController.getOutboxEvents);
