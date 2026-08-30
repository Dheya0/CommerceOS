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

    console.log('[PostgreSQL] Database is empty. Beginning initial seed into Cloud SQL...');

    const defaultStaffPasswordHash = hashPassword('CommerceOS@2026');
    const platformAdminPasswordHash = hashPassword('CommerceOS@HQ2026');

    // 1. Seed Platform Admins
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

    // 2. Seed Tenants
    for (const t of INITIAL_TENANTS) {
      await db.insert(tenants).values({
        id: t.id,
        name: t.name,
        slug: t.slug,
        domain: t.domain || `${t.slug}.commerceos.app`,
        customDomain: t.customDomain || null,
        plan: t.plan || 'business',
        status: t.status || 'active',
        logo: t.logo || null,
        currency: t.currency || 'SAR',
        theme: t.theme || null,
        settings: {
          contact: t.contact,
          shippingMethods: t.shippingMethods,
          paymentGateways: t.paymentGateways
        },
        createdAt: new Date(t.createdAt || Date.now()),
        updatedAt: new Date()
      });
    }

    // 3. Seed Staff
    for (const s of INITIAL_STAFF) {
      await db.insert(staff).values({
        id: s.id,
        tenantId: s.tenantId,
        name: s.name,
        email: s.email,
        role: s.role,
        status: s.status,
        avatar: s.avatar || null,
        permissions: s.permissions || null,
        passwordHash: defaultStaffPasswordHash,
        createdAt: new Date(s.createdAt || Date.now()),
        updatedAt: new Date()
      });
    }

    // 4. Seed Products
    for (const p of INITIAL_PRODUCTS) {
      await db.insert(products).values({
        id: p.id,
        tenantId: p.tenantId,
        title: p.name,
        description: p.description || '',
        price: p.price,
        originalPrice: p.comparePrice || null,
        costPrice: p.costPrice || null,
        stock: p.stock ?? 25,
        lowStockAlert: p.lowStockAlert ?? 5,
        category: p.categoryId || 'عام',
        image: p.images?.[0] || null,
        images: p.images || [],
        sku: p.sku || `SKU-${p.id}`,
        barcode: p.barcode || null,
        rating: String(p.rating || 5.0),
        ratingCount: p.reviewsCount || 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // 5. Seed Customers
    for (const c of INITIAL_CUSTOMERS) {
      await db.insert(customers).values({
        id: c.id,
        tenantId: c.tenantId,
        name: c.name,
        email: c.email,
        phone: c.phone,
        ordersCount: c.ordersCount || 0,
        totalSpent: c.totalSpent || 0,
        addresses: [{ city: c.city }],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // 6. Seed Coupons
    for (const cp of INITIAL_COUPONS) {
      await db.insert(coupons).values({
        id: cp.id,
        tenantId: cp.tenantId,
        code: cp.code,
        type: cp.type || 'percentage',
        value: cp.value,
        minSpend: cp.minSpend || 0,
        maxDiscount: null,
        usageLimit: cp.usageLimit || null,
        usageCount: cp.usageCount || 0,
        expiresAt: cp.expiresAt ? new Date(cp.expiresAt) : null,
        isActive: cp.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // 7. Seed Orders and Order Items
    for (const ord of INITIAL_ORDERS) {
      await db.insert(orders).values({
        id: ord.id,
        tenantId: ord.tenantId,
        customerName: ord.customer.name,
        customerEmail: ord.customer.email,
        customerPhone: ord.customer.phone,
        shippingAddress: ord.customer,
        items: ord.items,
        subtotal: ord.subtotal,
        discount: ord.discount || 0,
        shipping: ord.shipping || 0,
        total: ord.total,
        paymentMethod: ord.paymentMethod || 'mada',
        paymentStatus: ord.paymentStatus || 'paid',
        status: ord.status || 'new',
        couponCode: null,
        notes: ord.notes || null,
        createdAt: new Date(ord.createdAt || Date.now()),
        updatedAt: new Date()
      });

      for (const itm of ord.items) {
        await db.insert(orderItems).values({
          id: `itm_${Math.random().toString(36).substring(2, 8)}`,
          orderId: ord.id,
          tenantId: ord.tenantId,
          productId: itm.productId,
          title: itm.productName,
          price: itm.price,
          quantity: itm.quantity,
          total: itm.price * itm.quantity
        });
      }
    }

    // 8. Seed Audit Log
    await db.insert(auditLogs).values({
      id: `log_seed_postgres_init`,
      tenantId: 'tenant-royal-honey',
      action: 'DATABASE_MIGRATED_TO_POSTGRESQL',
      performedBy: 'System Bootstrap',
      details: {
        engine: 'Cloud SQL PostgreSQL',
        orm: 'Drizzle ORM',
        tenantsCount: INITIAL_TENANTS.length,
        productsCount: INITIAL_PRODUCTS.length,
        ordersCount: INITIAL_ORDERS.length
      },
      createdAt: new Date()
    });

    console.log('[PostgreSQL] Initial seed completed successfully into Cloud SQL!');
  } catch (err) {
    console.error('[PostgreSQL] Initial seed error:', err);
  }
}
