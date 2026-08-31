import { relations, sql } from 'drizzle-orm';
import {
  pgTable,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  serial
} from 'drizzle-orm/pg-core';

/**
 * TENANTS TABLE
 * Core multi-tenant organization entity.
 */
export const tenants = pgTable(
  'tenants',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    domain: text('domain'),
    customDomain: text('custom_domain'),
    plan: text('plan').notNull().default('business'),
    status: text('status').notNull().default('active'),
    logo: text('logo'),
    currency: text('currency').notNull().default('SAR'),
    theme: jsonb('theme'),
    settings: jsonb('settings'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index('idx_tenants_slug').on(table.slug),
    index('idx_tenants_status').on(table.status),
    index('idx_tenants_created_at').on(table.createdAt)
  ]
);

/**
 * PLATFORM HQ SUPER ADMINS
 * Sovereign platform overseers.
 */
export const platformAdmins = pgTable(
  'platform_admins',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    role: text('role').notNull().default('platform_super_admin'),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index('idx_platform_admins_email').on(table.email)
  ]
);

/**
 * STAFF MEMBERS TABLE
 * Tenant-scoped staff accounts with strict RBAC permissions and password hashes.
 */
export const staff = pgTable(
  'staff',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    email: text('email').notNull(),
    role: text('role').notNull().default('support_agent'),
    status: text('status').notNull().default('active'),
    avatar: text('avatar'),
    permissions: jsonb('permissions'),
    passwordHash: text('password_hash'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex('idx_staff_tenant_email').on(table.tenantId, table.email),
    index('idx_staff_tenant_role').on(table.tenantId, table.role),
    index('idx_staff_tenant_status').on(table.tenantId, table.status)
  ]
);

/**
 * PRODUCTS TABLE
 * Tenant-scoped catalog with strict integer stock and atomic reservation support.
 */
export const products = pgTable(
  'products',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    price: integer('price').notNull().default(0), // stored in SAR/cents
    originalPrice: integer('original_price'),
    costPrice: integer('cost_price'),
    stock: integer('stock').notNull().default(0),
    lowStockAlert: integer('low_stock_alert').notNull().default(5),
    category: text('category').notNull().default('عام'),
    image: text('image'),
    images: jsonb('images'),
    sku: text('sku'),
    barcode: text('barcode'),
    rating: numeric('rating', { precision: 3, scale: 2 }).default('5.00'),
    ratingCount: integer('rating_count').default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index('idx_products_tenant_category').on(table.tenantId, table.category),
    index('idx_products_tenant_stock').on(table.tenantId, table.stock),
    index('idx_products_tenant_sku').on(table.tenantId, table.sku),
    index('idx_products_tenant_active').on(table.tenantId, table.isActive)
  ]
);

/**
 * ORDERS TABLE
 * Atomic transaction-backed orders.
 */
export const orders = pgTable(
  'orders',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    customerName: text('customer_name').notNull(),
    customerEmail: text('customer_email').notNull(),
    customerPhone: text('customer_phone').notNull(),
    shippingAddress: jsonb('shipping_address'),
    items: jsonb('items').notNull(),
    subtotal: integer('subtotal').notNull().default(0),
    discount: integer('discount').notNull().default(0),
    shipping: integer('shipping').notNull().default(0),
    total: integer('total').notNull().default(0),
    paymentMethod: text('payment_method').notNull().default('mada'),
    paymentStatus: text('payment_status').notNull().default('paid'),
    status: text('status').notNull().default('new'),
    couponCode: text('coupon_code'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index('idx_orders_tenant_status').on(table.tenantId, table.status),
    index('idx_orders_tenant_created_at').on(table.tenantId, table.createdAt),
    index('idx_orders_tenant_customer_email').on(table.tenantId, table.customerEmail)
  ]
);

/**
 * ORDER ITEMS TABLE
 * Normalized line items.
 */
export const orderItems = pgTable(
  'order_items',
  {
    id: text('id').primaryKey(),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    productId: text('product_id'),
    title: text('title').notNull(),
    price: integer('price').notNull(),
    quantity: integer('quantity').notNull(),
    total: integer('total').notNull()
  },
  (table) => [
    index('idx_order_items_order_id').on(table.orderId),
    index('idx_order_items_tenant_product').on(table.tenantId, table.productId)
  ]
);

/**
 * CUSTOMERS TABLE
 * Tenant-isolated customer registry.
 */
export const customers = pgTable(
  'customers',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    ordersCount: integer('orders_count').notNull().default(0),
    totalSpent: integer('total_spent').notNull().default(0),
    addresses: jsonb('addresses'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex('idx_customers_tenant_email').on(table.tenantId, table.email),
    index('idx_customers_tenant_phone').on(table.tenantId, table.phone),
    index('idx_customers_tenant_total_spent').on(table.tenantId, table.totalSpent)
  ]
);

/**
 * COUPONS TABLE
 * Tenant-scoped coupons with strict usage limits and concurrency-safe tracking.
 */
export const coupons = pgTable(
  'coupons',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    code: text('code').notNull(),
    type: text('type').notNull().default('percentage'), // percentage | fixed
    value: integer('value').notNull(),
    minSpend: integer('min_spend').default(0),
    maxDiscount: integer('max_discount'),
    usageLimit: integer('usage_limit'),
    usageCount: integer('usage_count').notNull().default(0),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex('idx_coupons_tenant_code').on(table.tenantId, table.code),
    index('idx_coupons_tenant_active').on(table.tenantId, table.isActive),
    index('idx_coupons_tenant_expires').on(table.tenantId, table.expiresAt)
  ]
);

/**
 * ABANDONED CARTS TABLE
 */
export const abandonedCarts = pgTable(
  'abandoned_carts',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    customerName: text('customer_name').notNull(),
    customerEmail: text('customer_email').notNull(),
    customerPhone: text('customer_phone').notNull(),
    items: jsonb('items').notNull(),
    total: integer('total').notNull().default(0),
    recoveryStatus: text('recovery_status').notNull().default('pending'), // pending | contacted | recovered | expired
    lastActivity: timestamp('last_activity', { withTimezone: true }).defaultNow().notNull(),
    recoveredOrderId: text('recovered_order_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index('idx_abandoned_carts_tenant_status').on(table.tenantId, table.recoveryStatus),
    index('idx_abandoned_carts_tenant_email').on(table.tenantId, table.customerEmail)
  ]
);

/**
 * NOTIFICATIONS TABLE
 */
export const notifications = pgTable(
  'notifications',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    message: text('message').notNull(),
    type: text('type').notNull().default('info'),
    isRead: boolean('is_read').notNull().default(false),
    target: text('target'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index('idx_notifications_tenant_read').on(table.tenantId, table.isRead),
    index('idx_notifications_tenant_created').on(table.tenantId, table.createdAt)
  ]
);

/**
 * IDEMPOTENCY KEYS TABLE
 * Database-backed idempotency mechanism replacing in-memory maps.
 * Prevents double charging, duplicate order creation, and race conditions.
 */
export const idempotencyKeys = pgTable(
  'idempotency_keys',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id').notNull(),
    key: text('key').notNull(),
    requestMethod: text('request_method').notNull(),
    requestPath: text('request_path').notNull(),
    requestBodyHash: text('request_body_hash'),
    responseStatus: integer('response_status'),
    responseHeaders: jsonb('response_headers'),
    responseBody: jsonb('response_body'),
    status: text('status').notNull().default('processing'), // processing | completed | failed
    lockedAt: timestamp('locked_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
  },
  (table) => [
    uniqueIndex('idx_idempotency_tenant_key').on(table.tenantId, table.key),
    index('idx_idempotency_expires_at').on(table.expiresAt)
  ]
);

/**
 * AUDIT LOGS TABLE
 * Immutable transactional audit trail stored in PostgreSQL.
 */
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id').notNull(),
    action: text('action').notNull(),
    performedBy: text('performed_by').notNull(),
    details: jsonb('details'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index('idx_audit_logs_tenant_created').on(table.tenantId, table.createdAt),
    index('idx_audit_logs_action').on(table.action)
  ]
);

/**
 * BACKUPS TABLE
 * Database snapshot records and restore points.
 */
export const backups = pgTable(
  'backups',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id').notNull(),
    backupName: text('backup_name').notNull(),
    sizeBytes: integer('size_bytes').notNull().default(0),
    checksum: text('checksum').notNull(),
    tableCounts: jsonb('table_counts'),
    status: text('status').notNull().default('completed'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index('idx_backups_tenant_created').on(table.tenantId, table.createdAt)
  ]
);

/**
 * PAYMENT INTENTS TABLE
 * Authoritative financial entity tracking payment lifecycles.
 * States: PENDING -> AUTHORIZED -> PAID -> (REFUNDED | PARTIALLY_REFUNDED)
 * Terminal failure states: FAILED, CANCELLED
 */
export const paymentIntents = pgTable(
  'payment_intents',
  {
    id: text('id').primaryKey(), // e.g. pi_123456
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    amount: integer('amount').notNull(), // Exact order total in SAR / cents
    currency: text('currency').notNull().default('SAR'),
    provider: text('provider').notNull(), // moyasar, tap, tamara, tabby, hyperpay, bank_transfer, cod
    status: text('status').notNull().default('PENDING'), // PENDING | AUTHORIZED | PAID | FAILED | CANCELLED | REFUNDED | PARTIALLY_REFUNDED
    clientSecret: text('client_secret').notNull(),
    capturedAmount: integer('captured_amount').notNull().default(0),
    refundedAmount: integer('refunded_amount').notNull().default(0),
    paymentMethod: text('payment_method'), // mada, apple_pay, visa, tamara, tabby, etc.
    metadata: jsonb('metadata'),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index('idx_payment_intents_tenant_status').on(table.tenantId, table.status),
    index('idx_payment_intents_order').on(table.orderId),
    index('idx_payment_intents_created_at').on(table.tenantId, table.createdAt)
  ]
);

/**
 * PAYMENT ATTEMPTS & TRANSACTIONS TABLE
 * Records individual gateway processing attempts, 3DS challenges, and verified transaction IDs.
 */
export const paymentAttempts = pgTable(
  'payment_attempts',
  {
    id: text('id').primaryKey(), // e.g. txn_123456
    paymentIntentId: text('payment_intent_id')
      .notNull()
      .references(() => paymentIntents.id, { onDelete: 'cascade' }),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    transactionId: text('transaction_id'), // Gateway transaction reference (e.g. ch_xxx, pay_xxx)
    provider: text('provider').notNull(),
    method: text('method').notNull(),
    amount: integer('amount').notNull(),
    currency: text('currency').notNull().default('SAR'),
    status: text('status').notNull().default('PENDING'), // PENDING | AUTHORIZED | CAPTURED | FAILED | REFUNDED | VOIDED
    gatewayResponse: jsonb('gateway_response'),
    failureReason: text('failure_reason'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index('idx_payment_attempts_intent').on(table.paymentIntentId),
    index('idx_payment_attempts_transaction_id').on(table.transactionId),
    index('idx_payment_attempts_status').on(table.tenantId, table.status)
  ]
);

/**
 * REFUNDS TABLE
 * Tracks full and partial refunds with audit trail and gateway reference numbers.
 */
export const refunds = pgTable(
  'refunds',
  {
    id: text('id').primaryKey(), // e.g. ref_123456
    paymentIntentId: text('payment_intent_id')
      .notNull()
      .references(() => paymentIntents.id, { onDelete: 'cascade' }),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    transactionId: text('transaction_id'),
    gatewayRefundId: text('gateway_refund_id'),
    amount: integer('amount').notNull(),
    currency: text('currency').notNull().default('SAR'),
    reason: text('reason').notNull(),
    type: text('type').notNull().default('full'), // full | partial
    status: text('status').notNull().default('PENDING'), // PENDING | SUCCEEDED | FAILED
    initiatedBy: text('initiated_by').notNull(),
    gatewayResponse: jsonb('gateway_response'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index('idx_refunds_tenant_order').on(table.tenantId, table.orderId),
    index('idx_refunds_intent').on(table.paymentIntentId),
    index('idx_refunds_status').on(table.status)
  ]
);

/**
 * WEBHOOK EVENTS TABLE
 * Persistent gateway webhook event storage for replay attack prevention, HMAC auditing,
 * and deterministic transaction state machine execution.
 */
export const webhookEvents = pgTable(
  'webhook_events',
  {
    id: text('id').primaryKey(), // Synthetic or whevt_xxx
    tenantId: text('tenant_id').notNull(),
    gateway: text('gateway').notNull(), // moyasar, tap, tamara, tabby, hyperpay, custom
    eventId: text('event_id').notNull(), // Unique event ID assigned by the gateway
    eventType: text('event_type').notNull(), // e.g. payment.paid, payment.captured, order.approved
    signature: text('signature'),
    payload: jsonb('payload').notNull(),
    status: text('status').notNull().default('received'), // received | processing | verified | processed | rejected | duplicate | failed
    orderId: text('order_id'),
    paymentIntentId: text('payment_intent_id'),
    transactionId: text('transaction_id'),
    amount: integer('amount'),
    currency: text('currency'),
    processingTimeMs: integer('processing_time_ms'),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex('idx_webhook_gateway_event_unique').on(table.gateway, table.eventId),
    index('idx_webhook_events_tenant').on(table.tenantId, table.createdAt),
    index('idx_webhook_events_order').on(table.orderId),
    index('idx_webhook_events_status').on(table.status)
  ]
);

/**
 * INVENTORY MOVEMENTS TABLE (LEDGER)
 * Immutable audit ledger of all stock changes (INITIAL, SALE, RETURN, RESTOCK, ADJUSTMENT, CANCEL).
 */
export const inventoryMovements = pgTable(
  'inventory_movements',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    variantId: text('variant_id'),
    type: text('type').notNull(), // INITIAL | SALE | RETURN | RESTOCK | ADJUSTMENT | CANCEL | DAMAGE | RESERVATION | RELEASE
    quantity: integer('quantity').notNull(), // signed integer (e.g. -2 for sale, +10 for restock)
    referenceType: text('reference_type'), // order | return | adjustment | restock | reservation
    referenceId: text('reference_id'),
    beforeQuantity: integer('before_quantity').notNull(),
    afterQuantity: integer('after_quantity').notNull(),
    createdBy: text('created_by').notNull().default('system'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index('idx_inventory_movements_product').on(table.tenantId, table.productId),
    index('idx_inventory_movements_reference').on(table.referenceType, table.referenceId),
    index('idx_inventory_movements_created').on(table.tenantId, table.createdAt)
  ]
);

/**
 * COUPON REDEMPTIONS TABLE
 * Tracks individual coupon usages per order and customer with atomic concurrency protection.
 */
export const couponRedemptions = pgTable(
  'coupon_redemptions',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    couponId: text('coupon_id')
      .notNull()
      .references(() => coupons.id, { onDelete: 'cascade' }),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    customerEmail: text('customer_email').notNull(),
    discountAmount: integer('discount_amount').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex('idx_coupon_redemption_order').on(table.couponId, table.orderId),
    index('idx_coupon_redemptions_customer').on(table.tenantId, table.customerEmail),
    index('idx_coupon_redemptions_coupon').on(table.couponId)
  ]
);

/**
 * TRANSACTIONAL OUTBOX EVENTS TABLE
 * Durable background event dispatcher ensuring guaranteed at-least-once asynchronous event delivery.
 */
export const outboxEvents = pgTable(
  'outbox_events',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id').notNull(),
    eventType: text('event_type').notNull(), // order.created | payment.paid | refund.succeeded | inventory.low
    aggregateType: text('aggregate_type').notNull(), // order | payment | product | coupon
    aggregateId: text('aggregate_id').notNull(),
    payload: jsonb('payload').notNull(),
    status: text('status').notNull().default('pending'), // pending | published | failed
    retryCount: integer('retry_count').notNull().default(0),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    processedAt: timestamp('processed_at', { withTimezone: true })
  },
  (table) => [
    index('idx_outbox_events_status').on(table.status, table.createdAt),
    index('idx_outbox_events_tenant').on(table.tenantId, table.eventType)
  ]
);

/**
 * ASYNC BACKGROUND JOBS & DEAD LETTER QUEUE (DLQ)
 * Enterprise durable job execution with retry backoff, concurrency isolation, and DLQ.
 */
export const backgroundJobs = pgTable(
  'background_jobs',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id'),
    jobType: text('job_type').notNull(),
    payload: jsonb('payload').notNull(),
    status: text('status').notNull().default('queued'), // queued | processing | completed | failed | dead_letter | cancelled
    attempts: integer('attempts').notNull().default(0),
    maxAttempts: integer('max_attempts').notNull().default(3),
    lastError: text('last_error'),
    lockedBy: text('locked_by'),
    lockedUntil: timestamp('locked_until', { withTimezone: true }),
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true })
  },
  (table) => [
    index('idx_background_jobs_status_scheduled').on(table.status, table.scheduledFor),
    index('idx_background_jobs_tenant').on(table.tenantId, table.jobType)
  ]
);

/**
 * DISTRIBUTED LOCKS TABLE
 * Central database-backed distributed mutex for multi-instance single-executor scheduled tasks.
 */
export const distributedLocks = pgTable(
  'distributed_locks',
  {
    resourceKey: text('resource_key').primaryKey(),
    ownerToken: text('owner_token').notNull(),
    acquiredAt: timestamp('acquired_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
  },
  (table) => [
    index('idx_distributed_locks_expires').on(table.expiresAt)
  ]
);

// --- DRIZZLE RELATIONS ---
export const tenantsRelations = relations(tenants, ({ many }) => ({
  staff: many(staff),
  products: many(products),
  orders: many(orders),
  customers: many(customers),
  coupons: many(coupons),
  abandonedCarts: many(abandonedCarts),
  notifications: many(notifications),
  paymentIntents: many(paymentIntents),
  refunds: many(refunds),
  inventoryMovements: many(inventoryMovements),
  couponRedemptions: many(couponRedemptions)
}));

export const staffRelations = relations(staff, ({ one }) => ({
  tenant: one(tenants, {
    fields: [staff.tenantId],
    references: [tenants.id]
  })
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [products.tenantId],
    references: [tenants.id]
  }),
  orderItems: many(orderItems),
  inventoryMovements: many(inventoryMovements)
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [orders.tenantId],
    references: [tenants.id]
  }),
  items: many(orderItems),
  paymentIntents: many(paymentIntents),
  refunds: many(refunds),
  couponRedemptions: many(couponRedemptions)
}));

export const paymentIntentsRelations = relations(paymentIntents, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [paymentIntents.tenantId],
    references: [tenants.id]
  }),
  order: one(orders, {
    fields: [paymentIntents.orderId],
    references: [orders.id]
  }),
  attempts: many(paymentAttempts),
  refunds: many(refunds)
}));

export const paymentAttemptsRelations = relations(paymentAttempts, ({ one }) => ({
  paymentIntent: one(paymentIntents, {
    fields: [paymentAttempts.paymentIntentId],
    references: [paymentIntents.id]
  })
}));

export const refundsRelations = relations(refunds, ({ one }) => ({
  paymentIntent: one(paymentIntents, {
    fields: [refunds.paymentIntentId],
    references: [paymentIntents.id]
  }),
  order: one(orders, {
    fields: [refunds.orderId],
    references: [orders.id]
  })
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));

export const inventoryMovementsRelations = relations(inventoryMovements, ({ one }) => ({
  tenant: one(tenants, {
    fields: [inventoryMovements.tenantId],
    references: [tenants.id]
  }),
  product: one(products, {
    fields: [inventoryMovements.productId],
    references: [products.id]
  })
}));

export const couponRedemptionsRelations = relations(couponRedemptions, ({ one }) => ({
  tenant: one(tenants, {
    fields: [couponRedemptions.tenantId],
    references: [tenants.id]
  }),
  coupon: one(coupons, {
    fields: [couponRedemptions.couponId],
    references: [coupons.id]
  }),
  order: one(orders, {
    fields: [couponRedemptions.orderId],
    references: [orders.id]
  })
}));
