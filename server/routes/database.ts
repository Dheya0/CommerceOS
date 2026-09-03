import { Router, Request, Response } from 'express';
import { checkDbHealth } from '../../src/db/index.ts';
import { BackupService } from '../../src/db/services/backupService.ts';
import { AuditService } from '../../src/db/services/auditService.ts';
import { requirePermission } from '../middleware/auth.ts';

export const databaseRouter = Router();

// GET /api/v1/db/health - Comprehensive Database Health Check
databaseRouter.get('/health', async (req: Request, res: Response) => {
  const health = await checkDbHealth();
  const statusCode = health.connected ? 200 : 503;

  res.status(statusCode).json({
    status: health.connected ? 'healthy' : 'degraded',
    databaseEngine: 'Cloud SQL PostgreSQL (Developer Edition)',
    orm: 'Drizzle ORM',
    ...health,
    timestamp: new Date().toISOString()
  });
});

// GET /api/v1/db/backups - List backups for authenticated tenant (RBAC: settings)
databaseRouter.get('/backups', requirePermission('settings'), async (req: Request, res: Response) => {
  const tenantId = req.user!.tenantId;
  const backups = await BackupService.listBackups(tenantId);
  res.json({ backups, count: backups.length });
});

// POST /api/v1/db/backups - Create a new backup snapshot (RBAC: settings)
databaseRouter.post('/backups', requirePermission('settings'), async (req: Request, res: Response) => {
  const tenantId = req.user!.tenantId;
  const { name } = req.body;
  const result = await BackupService.createTenantBackup(tenantId, name);

  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }

  res.status(201).json({
    success: true,
    backupId: result.backupId,
    checksum: result.checksum,
    snapshot: result.data,
    message: 'تم إنشاء النسخة الاحتياطية وتأكيد سلامة التشفير (SHA-256 Checksum Verified)'
  });
});

// POST /api/v1/db/backups/validate - Validate backup snapshot & version compatibility
databaseRouter.post('/backups/validate', requirePermission('settings'), async (req: Request, res: Response) => {
  const { snapshot } = req.body;
  const validation = BackupService.validateBackupSnapshot(snapshot);
  res.json(validation);
});

// POST /api/v1/db/backups/restore - Restore tenant state from backup snapshot (RBAC: settings)
databaseRouter.post('/backups/restore', requirePermission('settings'), async (req: Request, res: Response) => {
  const tenantId = req.user!.tenantId;
  const { snapshot } = req.body;
  const result = await BackupService.restoreTenantBackup(tenantId, snapshot);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.json({
    success: true,
    restoredCounts: result.restoredCounts,
    message: 'تمت استعادة بيانات المتجر بنجاح وتحديث السجلات'
  });
});

// DELETE /api/v1/db/backups/:id - Delete backup record (RBAC: settings)
databaseRouter.delete('/backups/:id', requirePermission('settings'), async (req: Request, res: Response) => {
  const tenantId = req.user!.tenantId;
  const backupId = req.params.id;
  const success = await BackupService.deleteBackup(tenantId, backupId);
  res.json({ success });
});

// GET /api/v1/db/audit-logs - Query audit logs from PostgreSQL (RBAC: security or platform admin)
databaseRouter.get('/audit-logs', async (req: Request, res: Response) => {
  const isSuperAdmin = req.user?.role === 'platform_super_admin';
  const tenantId = isSuperAdmin && req.query.tenantId ? (req.query.tenantId as string) : req.user?.tenantId;

  if (!tenantId && !isSuperAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const logs = await AuditService.getLogsByTenant(tenantId || 'global', 100);
  res.json({ logs, count: logs.length });
});
