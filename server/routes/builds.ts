import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { buildFarmManager } from '../services/buildFarmQueue.ts';
import { db } from '../db.ts';
import { requireAuth, requirePermission } from '../middleware/auth.ts';

export const buildsRouter = Router();

// ==========================================
// 1. Trigger / Enqueue Build
// ==========================================
buildsRouter.post('/trigger', requireAuth, requirePermission('settings'), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const tenantId = (req as any).tenantId || user?.tenantId || (req.headers['x-tenant-id'] as string);
    const target = req.body.target || 'full_stack';
    const version = req.body.version || '1.0.0';

    const tenant = tenantId ? db.getTenantByIdOrSlug(tenantId) : null;
    if (!tenant) {
      return res.status(400).json({ error: 'Tenant context required to initiate build' });
    }

    const tenantProducts = db.getProducts(tenant.id);
    const tenantCategories = db.getCategories(tenant.id);

    const payload = {
      projectId: tenant.id,
      projectName: tenant.name,
      projectNameEn: tenant.slug,
      slug: tenant.slug,
      currency: tenant.currency || 'SAR',
      primaryColor: tenant.theme?.tokens?.primary || '#C9A45C',
      secondaryColor: tenant.theme?.tokens?.secondary || '#0B1422',
      supportEmail: user.email || 'support@commerceos.app',
      whatsappPhone: '+966500000000',
      businessType: tenant.businessType || 'retail',
      logoUrl: tenant.logo,
      adminEmail: user.email,
      adminName: user.name || 'Store Admin',
      hasLicense: true,
      target,
      version,
      products: tenantProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        stock: p.stock,
        category: p.categoryId,
        image: p.images?.[0] || ''
      })),
      categories: tenantCategories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.nameEn || c.id
      })),
      theme: {
        style: tenant.theme?.style,
        layout: tenant.theme?.layout,
        fontFamily: tenant.theme?.fontFamily
      }
    };

    const build = buildFarmManager.enqueueBuild({
      projectId: tenant.id,
      target,
      version,
      payload
    });

    res.status(202).json({
      success: true,
      message: 'Build job successfully enqueued in Code Factory pipeline',
      build
    });
  } catch (err: any) {
    console.error('Trigger build error:', err);
    res.status(500).json({ error: 'Internal build error', details: err.message });
  }
});

// ==========================================
// 2. Get Build Status & Logs
// ==========================================
buildsRouter.get('/:buildId', requireAuth, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { buildId } = req.params;
    const tenantId = (req as any).tenantId || user?.tenantId || (req.headers['x-tenant-id'] as string);
    const build = db.getBuildById(buildId, user.identityType === 'platform_admin' ? undefined : tenantId);

    if (!build) {
      return res.status(404).json({ error: 'Build job not found' });
    }

    res.json({ build });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve build status' });
  }
});

// ==========================================
// 3. List Builds for Tenant
// ==========================================
buildsRouter.get('/', requireAuth, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const tenantId = (req as any).tenantId || user?.tenantId || (req.headers['x-tenant-id'] as string);

    if (!tenantId && user.identityType !== 'platform_admin') {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const builds = db.getBuilds(user.identityType === 'platform_admin' ? undefined : tenantId);
    res.json({ builds });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to list builds' });
  }
});

// ==========================================
// 4. List Verified Artifacts for Tenant
// ==========================================
buildsRouter.get('/artifacts/list', requireAuth, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const tenantId = (req as any).tenantId || user?.tenantId || (req.headers['x-tenant-id'] as string);

    if (!tenantId && user.identityType !== 'platform_admin') {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const artifacts = db.getArtifacts(user.identityType === 'platform_admin' ? undefined : tenantId);
    res.json({ artifacts });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to list artifacts' });
  }
});

// ==========================================
// 5. Secure Artifact Download
// ==========================================
buildsRouter.get('/download/:artifactId', requireAuth, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const tenantId = (req as any).tenantId || user?.tenantId || (req.headers['x-tenant-id'] as string);
    const { artifactId } = req.params;

    // Search by artifact ID or Build ID
    let artifact = db.getArtifactById(artifactId);
    if (!artifact) {
      const allArtifacts = db.getArtifacts();
      artifact = allArtifacts.find(a => a.buildId === artifactId);
    }

    if (!artifact) {
      return res.status(404).json({ error: 'Artifact not found or has expired' });
    }

    // Tenant Isolation Check
    if (user.identityType !== 'platform_admin' && tenantId && artifact.projectId !== tenantId) {
      return res.status(403).json({ error: 'Access denied to this artifact package' });
    }

    const filePath = path.resolve(artifact.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Artifact file is missing on storage node' });
    }

    // Set download headers
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${artifact.fileName}"`);
    if (artifact.fileSizeBytes) {
      res.setHeader('Content-Length', artifact.fileSizeBytes);
    }
    if (artifact.checksum) {
      res.setHeader('X-Checksum-SHA256', artifact.checksum);
    }

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err: any) {
    console.error('Download artifact error:', err);
    res.status(500).json({ error: 'Failed to stream artifact package' });
  }
});
