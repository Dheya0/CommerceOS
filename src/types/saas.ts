export type TenantLifecycleState = 
  | 'LEAD'
  | 'REGISTERED'
  | 'TRIAL'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'GRACE_PERIOD'
  | 'SUSPENDED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type SaaSPlanId = 'starter' | 'growth' | 'business' | 'enterprise';

export type SubscriptionStatus = 
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'unpaid'
  | 'cancelled'
  | 'paused';

export type BillingStatus = 
  | 'good_standing'
  | 'payment_failed'
  | 'in_grace_period'
  | 'delinquent'
  | 'pending_invoice';

export type StoreOperationalStatus = 
  | 'live'
  | 'checkout_disabled'
  | 'read_only'
  | 'maintenance'
  | 'offline';

export type FeatureEntitlementKey = 
  | 'custom_domain'
  | 'advanced_analytics'
  | 'staff_accounts'
  | 'api_access'
  | 'webhooks'
  | 'ai_features'
  | 'custom_theme'
  | 'white_label'
  | 'code_export'
  | 'custom_reports'
  | 'sla_priority'
  | 'inventory_advanced';

export type UsageMetricKey = 
  | 'products'
  | 'orders_per_month'
  | 'staff'
  | 'storage_mb'
  | 'domains'
  | 'api_requests_per_month'
  | 'webhook_events_per_month'
  | 'ai_requests_per_month';

export interface SaaSPlan {
  id: SaaSPlanId;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  monthlyPrice: number;
  annualPrice: number; // in SAR, typically 10-12x with 20% discount
  currency: string;
  trialDays: number;
  version: string;
  status: 'active' | 'archived' | 'legacy';
  isPopular?: boolean;
  slaTier: 'standard' | 'business_99_5' | 'enterprise_99_9';
  entitlements: Record<FeatureEntitlementKey, boolean>;
  limits: Record<UsageMetricKey, number>; // -1 indicates unlimited
  featuresListAr: string[];
  featuresListEn: string[];
}

export interface TenantUsageRecord {
  tenantId: string;
  metric: UsageMetricKey;
  period: string; // e.g. "2026-08"
  currentUsage: number;
  limit: number;
  updatedAt: string;
  lastCalculatedAt: string;
}

export interface SaaSSubscription {
  id: string;
  tenantId: string;
  planId: SaaSPlanId;
  billingCycle: 'monthly' | 'yearly';
  provider: 'mock_system' | 'moyasar' | 'stripe' | 'manual_bank';
  providerSubscriptionId?: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart?: string;
  trialEnd?: string;
  cancelAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaaSSubscriptionItem {
  id: string;
  subscriptionId: string;
  type: 'base_plan' | 'extra_staff' | 'extra_storage' | 'extra_orders' | 'ai_pack';
  descriptionAr: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
}

export interface BillingCustomer {
  id: string;
  tenantId: string;
  providerCustomerId?: string;
  billingEmail: string;
  companyName: string;
  legalRepresentative?: string;
  taxId?: string; // Saudi VAT Number (15 digits)
  country: string;
  city: string;
  address: string;
  currency: string;
  vatRegistered: boolean;
}

export type SaaSInvoiceStatus = 
  | 'draft'
  | 'open'
  | 'pending'
  | 'paid'
  | 'past_due'
  | 'void'
  | 'uncollectible';

export interface SaaSInvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  descriptionAr: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  total: number;
}

export interface SaaSInvoice {
  id: string;
  tenantId: string;
  subscriptionId: string;
  invoiceNumber: string; // e.g. "INV-2026-0042"
  status: SaaSInvoiceStatus;
  currency: string;
  subtotal: number;
  tax: number; // 15% VAT
  discount: number;
  total: number;
  dueAt: string;
  paidAt?: string;
  periodStart: string;
  periodEnd: string;
  zatcaQrCode?: string;
  pdfUrl?: string;
  items: SaaSInvoiceItem[];
  createdAt: string;
}

export type DomainType = 'subdomain' | 'custom_domain' | 'platform_domain';
export type DomainVerificationStatus = 'pending' | 'verifying' | 'verified' | 'failed';
export type SslStatus = 'pending' | 'provisioning' | 'active' | 'renewal_required' | 'failed';

export interface DomainRecord {
  id: string;
  tenantId: string;
  hostname: string; // e.g. "www.royalhoney.sa"
  type: DomainType;
  status: DomainVerificationStatus;
  verificationMethod: 'cname' | 'dns_txt';
  verificationToken: string;
  verifiedAt?: string;
  sslStatus: SslStatus;
  isPrimary: boolean;
  cnameTarget: string;
  createdAt: string;
}

export interface ApiKeyRecord {
  id: string;
  tenantId: string;
  name: string;
  prefix: string; // e.g. "sk_live_a1b2..."
  keyHash: string;
  scopes: string[]; // ['products:read', 'orders:read', 'orders:write', ...]
  lastUsedAt?: string;
  expiresAt?: string;
  revokedAt?: string;
  createdAt: string;
}

export interface MerchantWebhookEndpoint {
  id: string;
  tenantId: string;
  name: string;
  url: string;
  secret: string; // HMAC secret
  events: string[]; // ['order.created', 'order.paid', 'product.stock_low', ...]
  isActive: boolean;
  failureCount: number;
  lastTriggeredAt?: string;
  createdAt: string;
}

export interface MerchantWebhookDelivery {
  id: string;
  webhookId: string;
  tenantId: string;
  event: string;
  payload: any;
  status: 'delivered' | 'failed' | 'retrying' | 'dead_letter';
  httpStatusCode?: number;
  responseBody?: string;
  durationMs: number;
  attemptNumber: number;
  nextRetryAt?: string;
  signature: string;
  createdAt: string;
}

export interface BillingAuditLogRecord {
  id: string;
  tenantId: string;
  action: 
    | 'PLAN_UPGRADE' 
    | 'PLAN_DOWNGRADE' 
    | 'PLAN_CANCEL' 
    | 'PLAN_REACTIVATE' 
    | 'TRIAL_STARTED' 
    | 'TRIAL_EXPIRED' 
    | 'INVOICE_PAID' 
    | 'PAYMENT_FAILED' 
    | 'GRACE_PERIOD_STARTED' 
    | 'TENANT_SUSPENDED' 
    | 'TENANT_REACTIVATED' 
    | 'MANUAL_QUOTA_OVERRIDE'
    | 'DOMAIN_VERIFIED';
  actor: string;
  reason?: string;
  beforeState: any;
  afterState: any;
  timestamp: string;
}

export interface SaaSPlatformMetrics {
  mrr: number; // Monthly Recurring Revenue in SAR
  arr: number; // Annual Recurring Revenue in SAR
  arpu: number; // Average Revenue Per User
  ltv: number; // Customer Lifetime Value
  churnRate: number; // Monthly Churn %
  trialConversionRate: number; // %
  activeTenantsCount: number;
  trialTenantsCount: number;
  pastDueTenantsCount: number;
  totalSubscribersCount: number;
  expansionRevenue: number;
  retentionRate: number;
}
