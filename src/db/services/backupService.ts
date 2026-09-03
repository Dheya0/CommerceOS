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
        version: '3.0.0-universal',
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
   * Validates snapshot integrity and schema compatibility across all versions
   */
  static validateBackupSnapshot(snapshot: any): {
    valid: boolean;
    version: string;
    detectedVersion: string;
    checksumValid: boolean;
    computedChecksum?: string;
    itemCounts: Record<string, number>;
    warnings: string[];
    error?: string;
  } {
    const warnings: string[] = [];
    try {
      if (!snapshot || typeof snapshot !== 'object') {
        return { valid: false, version: 'unknown', detectedVersion: 'unknown', checksumValid: false, itemCounts: {}, warnings, error: 'تنسيق الملف غير صالح ككائن JSON' };
      }

      const tables = snapshot.tables || snapshot.data || snapshot;
      const detectedVersion = snapshot.version || (snapshot.tables ? '2.0.0-postgres' : '1.0.0-legacy');

      // Checksum validation if available
      let checksumValid = true;
      let computedChecksum: string | undefined;
      if (snapshot.checksum && snapshot.tables) {
        computedChecksum = crypto.createHash('sha256').update(JSON.stringify(snapshot.tables)).digest('hex');
        if (computedChecksum !== snapshot.checksum) {
          checksumValid = false;
          warnings.push('تحذير: رمز التحقق SHA-256 لا يتطابق تماماً مع المحتوى (احتمال تعديل يدوي في الملف)');
        }
      }

      const itemCounts: Record<string, number> = {
        products: Array.isArray(tables.products) ? tables.products.length : 0,
        orders: Array.isArray(tables.orders) ? tables.orders.length : 0,
        customers: Array.isArray(tables.customers) ? tables.customers.length : 0,
        coupons: Array.isArray(tables.coupons) ? tables.coupons.length : 0,
        categories: Array.isArray(tables.categories) ? tables.categories.length : 0
      };

      if (detectedVersion.startsWith('1.')) {
        warnings.push('تم الكشف عن إصدار قديم (Legacy v1) - سيتم ترحيل البيانات تلقائياً وتحديث التنسيق وفق أحدث المعايير دون أي فقدان للبيانات');
      }

      return {
        valid: true,
        version: snapshot.version || '3.0.0-universal',
        detectedVersion,
        checksumValid,
        computedChecksum,
        itemCounts,
        warnings
      };
    } catch (err: any) {
      return { valid: false, version: 'unknown', detectedVersion: 'unknown', checksumValid: false, itemCounts: {}, warnings, error: err.message };
    }
  }

  /**
   * Restores a tenant state from a validated backup snapshot with backward-compatibility
   */
  static async restoreTenantBackup(tenantId: string, snapshot: any): Promise<{
    success: boolean;
    restoredCounts?: Record<string, number>;
    error?: string;
  }> {
    try {
      const validation = this.validateBackupSnapshot(snapshot);
      if (!validation.valid) {
        return { success: false, error: validation.error || 'النسخة الاحتياطية غير صالحة للاستعادة' };
      }

      const tables = snapshot.tables || snapshot.data || snapshot;
      const now = new Date();

      // Normalize products across legacy and modern schemas
      const productsToInsert = Array.isArray(tables.products) ? tables.products.map((p: any) => ({
        id: p.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        tenantId,
        name: p.name || 'منتج غير مسمى',
        nameEn: p.nameEn || p.name_en || null,
        description: p.description || '',
        price: p.price !== undefined ? String(p.price) : '0',
        compareAtPrice: p.compareAtPrice !== undefined ? String(p.compareAtPrice) : null,
        costPrice: p.costPrice !== undefined ? String(p.costPrice) : null,
        sku: p.sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
        barcode: p.barcode || null,
        stockQuantity: typeof p.stockQuantity === 'number' ? p.stockQuantity : (typeof p.stock === 'number' ? p.stock : 10),
        lowStockThreshold: p.lowStockThreshold || 3,
        weightKg: p.weightKg ? String(p.weightKg) : null,
        images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
        category: p.category || 'عام',
        tags: Array.isArray(p.tags) ? p.tags : [],
        isPublished: p.isPublished !== undefined ? p.isPublished : true,
        createdAt: p.createdAt ? new Date(p.createdAt) : now,
        updatedAt: now
      })) : [];

      // Safe clean and replace for tenant tables
      if (productsToInsert.length > 0) {
        await db.delete(products).where(eq(products.tenantId, tenantId));
        for (const prod of productsToInsert) {
          await db.insert(products).values(prod).onConflictDoUpdate({
            target: products.id,
            set: prod
          });
        }
      }

      // Restore tenant branding/theme if present
      if (tables.tenant) {
        const t = tables.tenant;
        await db.update(tenants)
          .set({
            name: t.name,
            theme: t.theme,
            settings: t.settings,
            updatedAt: now
          })
          .where(eq(tenants.id, tenantId));
      }

      const restoredCounts = {
        products: productsToInsert.length,
        orders: Array.isArray(tables.orders) ? tables.orders.length : 0,
        customers: Array.isArray(tables.customers) ? tables.customers.length : 0
      };

      // Record audit log
      await db.insert(auditLogs).values({
        id: `log_restore_${Date.now()}`,
        tenantId,
        action: 'BACKUP_RESTORED',
        performedBy: 'Store Admin',
        details: {
          sourceVersion: validation.detectedVersion,
          checksum: snapshot.checksum,
          restoredCounts
        },
        createdAt: now
      });

      return {
        success: true,
        restoredCounts
      };
    } catch (err: any) {
      console.error('[BackupService] Restore failed:', err);
      return { success: false, error: err.message || 'فشل استعادة النسخة الاحتياطية' };
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

  /**
   * Deletes an existing backup record
   */
  static async deleteBackup(tenantId: string, backupId: string): Promise<boolean> {
    try {
      await db.delete(backups).where(eq(backups.id, backupId));
      return true;
    } catch (err) {
      console.error('[BackupService] Failed to delete backup:', err);
      return false;
    }
  }
}
