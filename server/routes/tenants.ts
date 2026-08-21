import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requirePermission } from '../middleware/auth';
import { TenantStore } from '../../src/types';

export const tenantsRouter = Router();

// GET /api/v1/tenants - List all tenants
tenantsRouter.get('/', (req: Request, res: Response) => {
  const tenants = db.getTenants();
  res.json({
    tenants,
    count: tenants.length
  });
});

// GET /api/v1/tenants/current - Get resolved active tenant
tenantsRouter.get('/current', (req: Request, res: Response) => {
  if (!req.tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }
  res.json({
    tenant: req.tenant
  });
});

// GET /api/v1/tenants/:idOrSlug
tenantsRouter.get('/:idOrSlug', (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const tenant = db.getTenantByIdOrSlug(idOrSlug);
  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }
  res.json({ tenant });
});

// POST /api/v1/tenants - Create new tenant (StoreBuilderWizard)
tenantsRouter.post('/', (req: Request, res: Response) => {
  const tenantData: TenantStore = req.body;
  if (!tenantData.name || !tenantData.slug) {
    return res.status(400).json({ error: 'Missing name or slug' });
  }

  // Ensure unique ID & slug
  const existing = db.getTenantByIdOrSlug(tenantData.slug);
  if (existing) {
    return res.status(409).json({ error: 'Slug already taken', message: 'اسم المعرف هذا مستخدم لمتجر آخر' });
  }

  const id = tenantData.id || `tenant-${Date.now()}`;
  const newTenant: TenantStore = {
    ...tenantData,
    id,
    createdAt: tenantData.createdAt || new Date().toISOString(),
    status: tenantData.status || 'active'
  };

  const created = db.createTenant(newTenant);
  res.status(201).json({
    success: true,
    tenant: created
  });
});

// PUT /api/v1/tenants/:id - Update tenant settings
tenantsRouter.put('/:id', requirePermission('settings'), (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const updated = db.updateTenant(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Tenant not found' });
  }

  res.json({
    success: true,
    tenant: updated
  });
});

// PUT /api/v1/tenants/:id/theme - Update theme and design tokens
tenantsRouter.put('/:id/theme', requirePermission('theme'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { theme } = req.body;

  if (!theme) {
    return res.status(400).json({ error: 'Theme configuration missing' });
  }

  const updated = db.updateTenantTheme(id, theme);
  if (!updated) {
    return res.status(404).json({ error: 'Tenant not found' });
  }

  res.json({
    success: true,
    theme: updated.theme,
    tenant: updated
  });
});

// DELETE /api/v1/tenants/:id
tenantsRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteTenant(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Tenant not found' });
  }
  res.json({
    success: true,
    message: 'تم حذف المتجر وبياناته بنجاح'
  });
});

// POST /api/v1/tenants/:id/verify-domain
tenantsRouter.post('/:id/verify-domain', (req: Request, res: Response) => {
  const { id } = req.params;
  const { domain } = req.body;

  const tenant = db.updateTenant(id, {
    customDomain: domain,
    customDomainVerified: true
  });

  res.json({
    success: true,
    verified: true,
    domain,
    sslStatus: 'active',
    tenant
  });
});
