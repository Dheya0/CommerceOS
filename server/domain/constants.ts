export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  STORE_OWNER: 'store_owner',
  ORDER_MANAGER: 'order_manager',
  INVENTORY_MANAGER: 'inventory_manager',
  SUPPORT_AGENT: 'support_agent'
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PENDING_VERIFICATION: 'pending_verification',
  AUTHORIZED: 'authorized',
  PAID: 'paid',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
  FAILED: 'failed'
} as const;

export const PAYMENT_INTENT_STATUS = {
  PENDING: 'PENDING',
  AUTHORIZED: 'AUTHORIZED',
  CAPTURED: 'CAPTURED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
  PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED'
} as const;

export const WEBHOOK_PROVIDERS = ['moyasar', 'tamara', 'tabby', 'tap', 'hyperpay', 'custom'] as const;
export type WebhookProvider = typeof WEBHOOK_PROVIDERS[number];
