import { Router } from 'express';
import { requirePermission } from '../middleware/auth.ts';
import { tenantController } from '../controllers/tenant.controller.ts';
import { validateBody } from '../validators/validator.ts';
import { CreateTenantSchema } from '../validators/dtos.ts';

export const tenantsRouter = Router();

// GET /api/v1/tenants - List all tenants
tenantsRouter.get('/', tenantController.getTenants);

// GET /api/v1/tenants/:idOrSlug - Get single tenant
tenantsRouter.get('/:idOrSlug', tenantController.getTenantByIdOrSlug);

// POST /api/v1/tenants - Create tenant (Store Owner / Admin)
tenantsRouter.post('/', requirePermission('settings'), validateBody(CreateTenantSchema), tenantController.createTenant);

// PUT /api/v1/tenants/:id - Update tenant (Store Owner / Admin)
tenantsRouter.put('/:id', requirePermission('settings'), tenantController.updateTenant);

// PUT /api/v1/tenants/:id/theme - Update Store Theme & Branding
tenantsRouter.put('/:id/theme', requirePermission('theme'), tenantController.updateTenantTheme);

// DELETE /api/v1/tenants/:id - Delete tenant (Store Owner / Admin)
tenantsRouter.delete('/:id', requirePermission('settings'), tenantController.deleteTenant);
