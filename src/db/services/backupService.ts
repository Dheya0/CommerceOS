import crypto from 'crypto';
import { db } from '../index.ts';
import {
  tenants,
  products,
  orders,
  customers,
  coupons,
  staff,
  abandonedCarts,
  backups,
  auditLogs
} from '../schema.ts';
import { eq } from 'drizzle-orm';

export interface BackupSnapshot {
  tenantId: string;
  backupName: string;
  timestamp: string;
  version: string;
  checksum: string;
  tables: {
    tenant: any;
    products: any[];
    orders: any[];
    customers: any[];
    coupons: any[];
    staff: any[];
    abandonedCarts: any[];
  };
}

export class BackupService {
  /**
   * Generates an isolated JSON backup snapshot for a tenant and persists record in PostgreSQL
   */
  static async createTenantBackup(tenantId: string, customName?: string): Promise<{
    success: boolean;
    backupId?: string;
    checksum?: string;
    data?: BackupSnapshot;
    error?: string;
  }> {
    try {
      const tenantRows = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
      if (tenantRows.length === 0) {
        return { success: false, error: 'المتجر غير موجود' };
      }

      const tenantProducts = await db.select().from(products).where(eq(products.tenantId, tenantId));
      const tenantOrders = await db.select().from(orders).where(eq(orders.tenantId, tenantId));
      const tenantCustomers = await db.select().from(customers).where(eq(customers.tenantId, tenantId));
      const tenantCoupons = await db.select().from(coupons).where(eq(coupons.tenantId, tenantId));
      const tenantStaff = await db.select().from(staff).where(eq(staff.tenantId, tenantId));
      const tenantCarts = await db.select().from(abandonedCarts).where(eq(abandonedCarts.tenantId, tenantId));

      const payload = {
        tenant: tenantRows[0],
        products: tenantProducts,
        orders: tenantOrders,
        customers: tenantCustomers,
        coupons: tenantCoupons,
        staff: tenantStaff.map(s => ({ ...s, passwordHash: '***' })), // Redact passwords
        abandonedCarts: tenantCarts
      };

      const serialized = JSON.stringify(payload);
      const checksum = crypto.createHash('sha256').update(serialized).digest('hex');
      const backupId = `bkp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const backupName = customName || `نسخة احتياطية - ${tenantRows[0].name} (${new Date().toLocaleDateString('ar-SA')})`;
      const now = new Date();

      const tableCounts = {
        products: tenantProducts.length,
        orders: tenantOrders.length,
        customers: tenantCustomers.length,
        coupons: tenantCoupons.length,
        staff: tenantStaff.length
      };

      await db.insert(backups).values({
        id: backupId,
        tenantId,
        backupName,
        sizeBytes: Buffer.byteLength(serialized, 'utf8'),
        checksum,
        tableCounts,
        status: 'completed',
        createdAt: now
      });

      await db.insert(auditLogs).values({
        id: `log_${Date.now()}`,
        tenantId,
        action: 'BACKUP_CREATED',
        performedBy: 'Store Admin',
        details: { backupId, backupName, checksum, tableCounts },
        createdAt: now
      });

      const snapshot: BackupSnapshot = {
        tenantId,
        backupName,
        timestamp: now.toISOString(),
        version: '2.0.0-postgres',
        checksum,
        tables: payload
      };

      return {
        success: true,
        backupId,
        checksum,
        data: snapshot
      };
    } catch (err: any) {
      console.error('[BackupService] Backup creation failed:', err);
      return { success: false, error: err.message || 'فشل إنشاء النسخة الاحتياطية' };
    }
  }

  /**
   * Retrieves list of backups for a tenant
   */
  static async listBackups(tenantId: string) {
    try {
      return await db.select().from(backups).where(eq(backups.tenantId, tenantId));
    } catch (err) {
      console.error('[BackupService] Failed to list backups:', err);
      return [];
    }
  }
}
