import { db } from './index.ts';
import {
  tenants,
  platformAdmins,
  staff,
  products,
  orders,
  orderItems,
  customers,
  coupons,
  auditLogs
} from './schema.ts';
import {
  INITIAL_TENANTS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_COUPONS,
  INITIAL_STAFF
} from '../data/initialData.ts';
import { hashPassword } from '../../server/utils/security.ts';

export async function seedDatabaseIfEmpty() {
  try {
    const existingTenants = await db.select().from(tenants).limit(1);
    if (existingTenants.length > 0) {
      console.log('[PostgreSQL] Database already has records. Skipping initial seed.');
      return;
    }

    console.log('[PostgreSQL] Database initialized in clean zero-state.');

    // Only seed platform super admin if explicit environment bootstrap credentials are provided
    const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;
    const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;

    if (bootstrapEmail && bootstrapPassword && bootstrapPassword.length >= 12) {
      const platformAdminPasswordHash = hashPassword(bootstrapPassword);
      await db.insert(platformAdmins).values([
        {
          id: `admin-${Date.now()}`,
          name: process.env.ADMIN_BOOTSTRAP_NAME || 'CommerceOS Super Admin',
          email: bootstrapEmail.trim().toLowerCase(),
          role: 'platform_super_admin',
          passwordHash: platformAdminPasswordHash,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      console.log(`[PostgreSQL] Explicit platform bootstrap admin registered: ${bootstrapEmail}`);
    } else {
      console.log('[PostgreSQL] Zero-state ready. No default demo accounts created.');
    }
  } catch (err) {
    console.error('[PostgreSQL] Initial seed error:', err);
  }
}
