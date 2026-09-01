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

    console.log('[PostgreSQL] Database is empty. Initializing clean production state (0 tenants, 0 stores)...');

    const platformAdminPasswordHash = hashPassword('CommerceOS@HQ2026');

    // 1. Seed Platform Admins only
    await db.insert(platformAdmins).values([
      {
        id: 'admin-super-01',
        name: 'CommerceOS Platform Super Admin',
        email: 'superadmin@commerceos.app',
        role: 'platform_super_admin',
        passwordHash: platformAdminPasswordHash,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('[PostgreSQL] Clean production database initialized successfully (Zero default demo stores).');
  } catch (err) {
    console.error('[PostgreSQL] Initial seed error:', err);
  }
}
