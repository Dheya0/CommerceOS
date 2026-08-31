import crypto from 'crypto';
import { 
  SaaSPlan, 
  SaaSPlanId, 
  FeatureEntitlementKey, 
  UsageMetricKey, 
  TenantUsageRecord, 
  SaaSSubscription, 
  BillingCustomer, 
  SaaSInvoice, 
  SaaSInvoiceItem, 
  DomainRecord, 
  ApiKeyRecord, 
  MerchantWebhookEndpoint, 
  MerchantWebhookDelivery, 
  BillingAuditLogRecord, 
  SaaSPlatformMetrics,
  TenantLifecycleState,
  SubscriptionStatus,
  BillingStatus,
  StoreOperationalStatus
} from '../../src/types/saas';
import { db } from '../db';
import { logger } from '../infrastructure/logger';

// -------------------------------------------------------------
// 1. Official Commercial Plans Catalog
// -------------------------------------------------------------
export const SAAS_PLANS: Record<SaaSPlanId, SaaSPlan> = {
  starter: {
    id: 'starter',
    name: 'Starter Trial',
    nameAr: 'الباقة الابتدائية (تجريبية)',
    slug: 'starter',
    description: 'Perfect for new merchants launching their first online brand with essential commerce features.',
    descriptionAr: 'مثالية للعلامات التجارية والمتاجر الناشئة لتجربة المنصة وإطلاق أول متجر متكامل.',
    monthlyPrice: 0,
    annualPrice: 0,
    currency: 'SAR',
    trialDays: 14,
    version: '2026.1',
    status: 'active',
    slaTier: 'standard',
    entitlements: {
      custom_domain: false,
      advanced_analytics: false,
      staff_accounts: false,
      api_access: false,
      webhooks: false,
      ai_features: false,
      custom_theme: true,
      white_label: false,
      code_export: false,
      custom_reports: false,
      sla_priority: false,
      inventory_advanced: false
    },
    limits: {
      products: 50,
      orders_per_month: 200,
      staff: 1,
      storage_mb: 500,
      domains: 1,
      api_requests_per_month: 5000,
      webhook_events_per_month: 0,
      ai_requests_per_month: 0
    },
    featuresListAr: [
      'حتى 50 منتج نشط',
      '200 طلب شهرياً بدون عمولة',
      'حساب موظف واحد (المالك)',
      'نطاق فرعي مجاني (.commerceos.app)',
      'بوابات الدفع الأساسية والحوالات البنكية',
      'دعم فني عبر البريد الإلكتروني'
    ],
    featuresListEn: [
      'Up to 50 active products',
      '200 orders/month with 0% commission',
      '1 Staff Account',
      'Free platform subdomain',
      'Core payment gateways & bank transfers',
      'Standard email support'
    ]
  },
  growth: {
    id: 'growth',
    name: 'Growth Plan',
    nameAr: 'باقة النمو والتوسع',
    slug: 'growth',
    description: 'Designed for scaling digital merchants who require custom branding, automation, and higher volume.',
    descriptionAr: 'مصممة للمتاجر سريعة النمو التي تحتاج لربط دومين خاص، تحليلات متقدمة، وأتمتة العمليات.',
    monthlyPrice: 199,
    annualPrice: 1990, // 2 months free (savings of 398 SAR)
    currency: 'SAR',
    trialDays: 14,
    version: '2026.1',
    status: 'active',
    isPopular: true,
    slaTier: 'business_99_5',
    entitlements: {
      custom_domain: true,
      advanced_analytics: true,
      staff_accounts: true,
      api_access: true,
      webhooks: true,
      ai_features: true,
      custom_theme: true,
      white_label: false,
      code_export: true,
      custom_reports: true,
      sla_priority: false,
      inventory_advanced: true
    },
    limits: {
      products: 500,
      orders_per_month: 2500,
      staff: 5,
      storage_mb: 5000,
      domains: 2,
      api_requests_per_month: 100000,
      webhook_events_per_month: 25000,
      ai_requests_per_month: 150
    },
    featuresListAr: [
      'حتى 500 منتج نشط',
      '2,500 طلب شهرياً بدون عمولة',
      'ربط دومين مخصص مجاني (SSL مشمول)',
      'حتى 5 حسابات موظفين بصلاحيات مفصلة',
      'محرر Visual IDE واستوديو الثيمات المتقدم',
      'خطافات الويب (Webhooks) ومفاتيح API',
      'تصدير كود المتجر وتطبيقات PWA',
      '150 عملية ذكاء اصطناعي لتوليد أوصاف وصور المنتجات'
    ],
    featuresListEn: [
      'Up to 500 active products',
      '2,500 orders/month',
      'Custom Domain with free SSL',
      'Up to 5 Staff Accounts with granular RBAC',
      'Visual IDE & Live Studio themes',
      'Webhooks & API access',
      'Code export & PWA installable app',
      '150 AI generations for copy & products'
    ]
  },
  business: {
    id: 'business',
    name: 'Business Enterprise',
    nameAr: 'باقة الأعمال والمؤسسات',
    slug: 'business',
    description: 'Comprehensive tier for high-volume retailers and brands requiring deep ERP integrations and team collaboration.',
    descriptionAr: 'للمتاجر الكبرى وسلاسل التجزئة التي تتطلب تكاملاً عميقاً مع برامج المحاسبة ومخازن متعددة.',
    monthlyPrice: 499,
    annualPrice: 4990,
    currency: 'SAR',
    trialDays: 14,
    version: '2026.1',
    status: 'active',
    slaTier: 'business_99_5',
    entitlements: {
      custom_domain: true,
      advanced_analytics: true,
      staff_accounts: true,
      api_access: true,
      webhooks: true,
      ai_features: true,
      custom_theme: true,
      white_label: false,
      code_export: true,
      custom_reports: true,
      sla_priority: true,
      inventory_advanced: true
    },
    limits: {
      products: 5000,
      orders_per_month: 20000,
      staff: 15,
      storage_mb: 25000,
      domains: 5,
      api_requests_per_month: 500000,
      webhook_events_per_month: 100000,
      ai_requests_per_month: 600
    },
    featuresListAr: [
      'حتى 5,000 منتج نشط',
      '20,000 طلب شهرياً بدون عمولة إضافية',
      'حتى 15 حساب موظف وصلاحيات متقدمة',
      '5 دومينات مخصصة مع إعادة التوجيه الذكي',
      'تقارير ضريبية مفصلة معتمدة من هيئة الزكاة والضريبة (ZATCA)',
      'سعة تخزين 25 جيجابايت للصور والفيديوهات',
      'تكاملات غير محدودة عبر API وخطافات ويب سريعة',
      'أولوية الدعم الفني المباشر 24/7'
    ],
    featuresListEn: [
      'Up to 5,000 active products',
      '20,000 orders/month',
      '15 Staff accounts with RBAC',
      '5 Custom domains with smart redirect',
      'ZATCA-ready tax invoicing and reports',
      '25 GB high-speed media storage',
      'High-throughput Webhooks & REST APIs',
      '24/7 Dedicated priority support'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Sovereign White-Label Enterprise',
    nameAr: 'الباقة السيادية والوايت ليبل',
    slug: 'enterprise',
    description: 'Autonomous, self-hostable white-label deployment for agencies, conglomerates, and sovereign digital commerce.',
    descriptionAr: 'الباقة الشاملة لإزالة علامة CommerceOS، تشغيل المتاجر السيادية، وتخصيص البنية التحتية بالكامل.',
    monthlyPrice: 1299,
    annualPrice: 12990,
    currency: 'SAR',
    trialDays: 30,
    version: '2026.1',
    status: 'active',
    slaTier: 'enterprise_99_9',
    entitlements: {
      custom_domain: true,
      advanced_analytics: true,
      staff_accounts: true,
      api_access: true,
      webhooks: true,
      ai_features: true,
      custom_theme: true,
      white_label: true,
      code_export: true,
      custom_reports: true,
      sla_priority: true,
      inventory_advanced: true
    },
    limits: {
      products: -1, // Unlimited
      orders_per_month: -1, // Unlimited
      staff: -1, // Unlimited
      storage_mb: 100000, // 100 GB
      domains: 20,
      api_requests_per_month: -1,
      webhook_events_per_month: -1,
      ai_requests_per_month: 2500
    },
    featuresListAr: [
      'منتجات وطلبات وموظفين غير محدودين',
      'إزالة كاملة لعلامة CommerceOS (White-Label)',
      'تخصيص الهوية والشعارات والفوتر بالكامل',
      'توليد حزم وتطبيقات Native iOS & Android جاهزة للرفع',
      'استضافة سيادية مع دعم Docker Containers وCloud SQL',
      'توقيع وتشفير المفاتيح البرمجية (Code Signing)',
      'اتفاقية مستوى الخدمة 99.9% SLA ومدير حساب مخصص'
    ],
    featuresListEn: [
      'Unlimited products, orders, and staff seats',
      'Full White-Label (Zero CommerceOS branding)',
      'Custom branding, domain, and platform emails',
      'Pre-compiled Native iOS & Android app binaries',
      'Sovereign Docker & Cloud SQL deployment options',
      'Cryptographic Code Signing & integrity verification',
      '99.9% Uptime SLA with dedicated account manager'
    ]
  }
};

// -------------------------------------------------------------
// In-Memory & Persistent State for SaaS Subscriptions & Usage
// -------------------------------------------------------------
class SaaSBillingEngine {
  private subscriptions: Map<string, SaaSSubscription> = new Map();
  private billingCustomers: Map<string, BillingCustomer> = new Map();
  private invoices: Map<string, SaaSInvoice> = new Map();
  private domains: Map<string, DomainRecord> = new Map();
  private apiKeys: Map<string, ApiKeyRecord> = new Map();
  private webhooks: Map<string, MerchantWebhookEndpoint> = new Map();
  private webhookDeliveries: Map<string, MerchantWebhookDelivery> = new Map();
  private billingAuditLogs: BillingAuditLogRecord[] = [];
  private processedWebhookEvents: Set<string> = new Set();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Seed Flagship Tenant: Royal Honey (Pro / Business)
    const royalHoneySub: SaaSSubscription = {
      id: 'sub-royal-honey-01',
      tenantId: 'tenant-royal-honey',
      planId: 'business',
      billingCycle: 'yearly',
      provider: 'mock_system',
      providerSubscriptionId: 'sub_moy_live_998823',
      status: 'active',
      currentPeriodStart: new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString(),
      currentPeriodEnd: new Date(now.getFullYear() + 1, now.getMonth() - 2, 1).toISOString(),
      createdAt: '2026-01-10T10:00:00Z',
      updatedAt: now.toISOString()
    };
    this.subscriptions.set(royalHoneySub.tenantId, royalHoneySub);

    const royalHoneyCustomer: BillingCustomer = {
      id: 'bcust-royal-01',
      tenantId: 'tenant-royal-honey',
      billingEmail: 'billing@royalhoney.sa',
      companyName: 'شركة مناحل الملكي المحدودة للتجارة',
      legalRepresentative: 'عبدالله بن فهد الملكي',
      taxId: '310998823100003',
      country: 'SA',
      city: 'الرياض',
      address: 'طريق الملك فهد، برج التجارة الرقمية، الطابق 14',
      currency: 'SAR',
      vatRegistered: true
    };
    this.billingCustomers.set(royalHoneyCustomer.tenantId, royalHoneyCustomer);

    // Seed Flagship Invoice
    const invoice1: SaaSInvoice = {
      id: 'inv-2026-0089',
      tenantId: 'tenant-royal-honey',
      subscriptionId: royalHoneySub.id,
      invoiceNumber: 'INV-2026-0089',
      status: 'paid',
      currency: 'SAR',
      subtotal: 4990,
      tax: 748.5,
      discount: 0,
      total: 5738.5,
      dueAt: royalHoneySub.currentPeriodStart,
      paidAt: royalHoneySub.currentPeriodStart,
      periodStart: royalHoneySub.currentPeriodStart,
      periodEnd: royalHoneySub.currentPeriodEnd,
      zatcaQrCode: this.generateZatcaQr(
        'CommerceOS Cloud Inc.',
        '310000998800003',
        royalHoneySub.currentPeriodStart,
        5738.5,
        748.5
      ),
      items: [
        {
          id: 'item-inv-1',
          invoiceId: 'inv-2026-0089',
          description: 'CommerceOS Business Plan - Annual Subscription',
          descriptionAr: 'اشتراك باقة الأعمال والمؤسسات - سنوي (خصم شهرين مجاناً)',
          quantity: 1,
          unitPrice: 4990,
          tax: 748.5,
          discount: 0,
          total: 5738.5
        }
      ],
      createdAt: royalHoneySub.currentPeriodStart
    };
    this.invoices.set(invoice1.id, invoice1);

    // Seed Custom Domain for Royal Honey
    const domain1: DomainRecord = {
      id: 'dom-royal-01',
      tenantId: 'tenant-royal-honey',
      hostname: 'www.royalhoney.sa',
      type: 'custom_domain',
      status: 'verified',
      verificationMethod: 'cname',
      verificationToken: 'cname-verify-royalhoney-88912',
      verifiedAt: '2026-01-11T12:00:00Z',
      sslStatus: 'active',
      isPrimary: true,
      cnameTarget: 'stores.commerceos.app',
      createdAt: '2026-01-10T11:00:00Z'
    };
    this.domains.set(domain1.id, domain1);

    // Seed API Key for Royal Honey
    const apiKey1: ApiKeyRecord = {
      id: 'key-royal-01',
      tenantId: 'tenant-royal-honey',
      name: 'ERP Integration Key (Odoo Connector)',
      prefix: 'sk_live_rh_89f2',
      keyHash: crypto.createHash('sha256').update('sk_live_rh_89f2_secret_token_live').digest('hex'),
      scopes: ['products:read', 'products:write', 'orders:read', 'orders:write', 'inventory:read', 'inventory:write'],
      lastUsedAt: new Date(Date.now() - 3600000).toISOString(),
      createdAt: '2026-01-15T09:00:00Z'
    };
    this.apiKeys.set(apiKey1.id, apiKey1);

    // Seed Merchant Webhook for Royal Honey
    const webhook1: MerchantWebhookEndpoint = {
      id: 'wh-royal-01',
      tenantId: 'tenant-royal-honey',
      name: 'Main Logistics Dispatcher (SMSA & DHL)',
      url: 'https://api.royalhoney.sa/webhooks/commerceos/orders',
      secret: 'whsec_99a8b7c6d5e4f3a2b1c0',
      events: ['order.created', 'order.paid', 'order.status_updated', 'inventory.low_stock'],
      isActive: true,
      failureCount: 0,
      lastTriggeredAt: new Date(Date.now() - 7200000).toISOString(),
      createdAt: '2026-01-15T09:30:00Z'
    };
    this.webhooks.set(webhook1.id, webhook1);

    // Seed Other Initial Tenants
    const otherTenants = [
      { id: 'tenant-urban-threads', plan: 'growth' as SaaSPlanId, status: 'active' as SubscriptionStatus },
      { id: 'tenant-serene-coffee', plan: 'starter' as SaaSPlanId, status: 'trialing' as SubscriptionStatus },
      { id: 'tenant-oud-luxury', plan: 'growth' as SaaSPlanId, status: 'active' as SubscriptionStatus },
      { id: 'tenant-nexus-tech', plan: 'business' as SaaSPlanId, status: 'active' as SubscriptionStatus }
    ];

    for (const ot of otherTenants) {
      const sub: SaaSSubscription = {
        id: `sub-${ot.id}`,
        tenantId: ot.id,
        planId: ot.plan,
        billingCycle: 'monthly',
        provider: 'mock_system',
        providerSubscriptionId: `sub_live_${ot.id.slice(-6)}`,
        status: ot.status,
        currentPeriodStart: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        currentPeriodEnd: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
        trialStart: ot.status === 'trialing' ? new Date().toISOString() : undefined,
        trialEnd: ot.status === 'trialing' ? new Date(Date.now() + 14 * 86400000).toISOString() : undefined,
        createdAt: '2026-02-01T00:00:00Z',
        updatedAt: now.toISOString()
      };
      this.subscriptions.set(ot.id, sub);

      const cust: BillingCustomer = {
        id: `bcust-${ot.id}`,
        tenantId: ot.id,
        billingEmail: `finance@${ot.id.replace('tenant-', '')}.sa`,
        companyName: `متجر ${ot.id.replace('tenant-', '')}`,
        country: 'SA',
        city: 'الرياض',
        address: 'المملكة العربية السعودية',
        currency: 'SAR',
        vatRegistered: true
      };
      this.billingCustomers.set(ot.id, cust);
    }
  }

  // -------------------------------------------------------------
  // 2. Entitlement Evaluation Service
  // -------------------------------------------------------------
  public can(tenantId: string, feature: FeatureEntitlementKey): boolean {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    if (!tenant) return false;

    // Check White-Label / Sovereign licensing override
    if (feature === 'white_label' && tenant.licensing?.isWhiteLabel) {
      return true;
    }

    const sub = this.subscriptions.get(tenant.id);
    const planId: SaaSPlanId = sub?.planId || (tenant.plan as SaaSPlanId) || 'starter';
    const plan = SAAS_PLANS[planId] || SAAS_PLANS.starter;

    return Boolean(plan.entitlements[feature]);
  }

  public assertEntitlement(tenantId: string, feature: FeatureEntitlementKey): void {
    if (!this.can(tenantId, feature)) {
      const tenant = db.getTenantByIdOrSlug(tenantId);
      const planId = this.subscriptions.get(tenantId)?.planId || tenant?.plan || 'starter';
      throw new Error(
        `الميزة المطلوبة [${feature}] غير مشمولة في باقتك الحالية (${planId.toUpperCase()}). يرجى ترقية الخطة لتفعيل هذه الميزة.`
      );
    }
  }

  // -------------------------------------------------------------
  // 3. Usage Metering & Atomic Quotas Engine
  // -------------------------------------------------------------
  public getTenantUsage(tenantId: string): Record<UsageMetricKey, { current: number; limit: number; percentage: number; isExceeded: boolean }> {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    const resolvedTenantId = tenant ? tenant.id : tenantId;
    const sub = this.subscriptions.get(resolvedTenantId);
    const planId: SaaSPlanId = sub?.planId || (tenant?.plan as SaaSPlanId) || 'starter';
    const plan = SAAS_PLANS[planId] || SAAS_PLANS.starter;

    // Calculate source-of-truth metrics from database
    const productsCount = db.getProducts(resolvedTenantId).length;
    const staffCount = db.getStaff(resolvedTenantId).length;
    
    // Count orders in current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const ordersThisMonth = db.getOrders(resolvedTenantId).filter(o => {
      const orderTime = new Date(o.createdAt).getTime();
      return orderTime >= firstDayOfMonth;
    }).length;

    // Count verified domains
    const domainsCount = Array.from(this.domains.values()).filter(d => d.tenantId === resolvedTenantId).length;

    // Measured storage & API usage (simulated or persisted)
    const storageMb = tenant?.quotas?.usedStorageMb || Math.round(productsCount * 2.8 + 15);
    const apiRequests = 1240;
    const webhookEvents = 380;
    const aiRequests = 18;

    const buildMetric = (current: number, limit: number) => {
      if (limit === -1) {
        return { current, limit: -1, percentage: 0, isExceeded: false };
      }
      const percentage = limit > 0 ? Math.min(100, Math.round((current / limit) * 100)) : 0;
      return {
        current,
        limit,
        percentage,
        isExceeded: current >= limit
      };
    };

    return {
      products: buildMetric(productsCount, plan.limits.products),
      orders_per_month: buildMetric(ordersThisMonth, plan.limits.orders_per_month),
      staff: buildMetric(staffCount, plan.limits.staff),
      storage_mb: buildMetric(storageMb, plan.limits.storage_mb),
      domains: buildMetric(domainsCount, plan.limits.domains),
      api_requests_per_month: buildMetric(apiRequests, plan.limits.api_requests_per_month),
      webhook_events_per_month: buildMetric(webhookEvents, plan.limits.webhook_events_per_month),
      ai_requests_per_month: buildMetric(aiRequests, plan.limits.ai_requests_per_month)
    };
  }

  public assertQuota(tenantId: string, metric: UsageMetricKey, delta: number = 1): { allowed: boolean; remaining: number; limit: number; current: number; error?: string } {
    const usage = this.getTenantUsage(tenantId)[metric];
    if (usage.limit === -1) {
      return { allowed: true, remaining: 999999, limit: -1, current: usage.current };
    }

    const projected = usage.current + delta;
    if (projected > usage.limit) {
      return {
        allowed: false,
        remaining: Math.max(0, usage.limit - usage.current),
        limit: usage.limit,
        current: usage.current,
        error: `تم الوصول للحد الأقصى المسموح به لـ [${metric}] في باقتك الحالية (${usage.current}/${usage.limit}). يرجى الترقية لإضافة المزيد.`
      };
    }

    return {
      allowed: true,
      remaining: usage.limit - projected,
      limit: usage.limit,
      current: usage.current
    };
  }

  // -------------------------------------------------------------
  // 4. Subscription Management & Lifecycle State Machine
  // -------------------------------------------------------------
  public getSubscription(tenantId: string): SaaSSubscription | undefined {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    const resolvedTenantId = tenant ? tenant.id : tenantId;
    return this.subscriptions.get(resolvedTenantId);
  }

  public getBillingCustomer(tenantId: string): BillingCustomer | undefined {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    const resolvedTenantId = tenant ? tenant.id : tenantId;
    return this.billingCustomers.get(resolvedTenantId);
  }

  public updateBillingCustomer(tenantId: string, updates: Partial<BillingCustomer>): BillingCustomer {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    const resolvedTenantId = tenant ? tenant.id : tenantId;
    const existing = this.billingCustomers.get(resolvedTenantId) || {
      id: `bcust-${Date.now()}`,
      tenantId: resolvedTenantId,
      billingEmail: 'finance@store.sa',
      companyName: tenant?.name || 'Store Merchant',
      country: 'SA',
      city: 'الرياض',
      address: 'المملكة العربية السعودية',
      currency: 'SAR',
      vatRegistered: true
    };

    const updated = { ...existing, ...updates };
    this.billingCustomers.set(resolvedTenantId, updated);
    return updated;
  }

  /**
   * Upgrade Plan with Immediate Entitlement & Prorated Invoicing
   */
  public upgradePlan(
    tenantId: string, 
    newPlanId: SaaSPlanId, 
    billingCycle: 'monthly' | 'yearly' = 'monthly',
    actor: string = 'Merchant'
  ): { subscription: SaaSSubscription; invoice: SaaSInvoice } {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    if (!tenant) throw new Error('المتجر غير موجود');

    const oldSub = this.subscriptions.get(tenant.id);
    const oldPlanId = oldSub?.planId || 'starter';
    const newPlan = SAAS_PLANS[newPlanId];
    if (!newPlan) throw new Error('الخطة المختارة غير صالحة');

    const now = new Date();
    const price = billingCycle === 'yearly' ? newPlan.annualPrice : newPlan.monthlyPrice;
    const periodEnd = billingCycle === 'yearly' 
      ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString()
      : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString();

    const updatedSub: SaaSSubscription = {
      id: oldSub ? oldSub.id : `sub-${tenant.id}-${Date.now()}`,
      tenantId: tenant.id,
      planId: newPlanId,
      billingCycle,
      provider: 'mock_system',
      providerSubscriptionId: `sub_live_${Date.now()}`,
      status: 'active',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd,
      createdAt: oldSub ? oldSub.createdAt : now.toISOString(),
      updatedAt: now.toISOString()
    };
    this.subscriptions.set(tenant.id, updatedSub);

    // Update Tenant entity
    db.updateTenant(tenant.id, {
      plan: newPlanId as any,
      status: 'active',
      lifecycleState: 'ACTIVE',
      subscriptionStatus: 'active',
      billingStatus: 'good_standing',
      storeOperationalStatus: 'live'
    });

    // Create & Pay SaaS Tax Invoice
    const tax = Math.round(price * 0.15 * 100) / 100;
    const total = price + tax;
    const invoiceNumber = `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice: SaaSInvoice = {
      id: `inv-${Date.now()}`,
      tenantId: tenant.id,
      subscriptionId: updatedSub.id,
      invoiceNumber,
      status: 'paid',
      currency: 'SAR',
      subtotal: price,
      tax,
      discount: 0,
      total,
      dueAt: now.toISOString(),
      paidAt: now.toISOString(),
      periodStart: now.toISOString(),
      periodEnd,
      zatcaQrCode: this.generateZatcaQr(
        'CommerceOS Cloud SaaS Inc.',
        '310000998800003',
        now.toISOString(),
        total,
        tax
      ),
      items: [
        {
          id: `item-${Date.now()}`,
          invoiceId: `inv-${Date.now()}`,
          description: `CommerceOS ${newPlan.name} (${billingCycle === 'yearly' ? 'Annual' : 'Monthly'})`,
          descriptionAr: `اشتراك ${newPlan.nameAr} (${billingCycle === 'yearly' ? 'سنوي' : 'شهري'})`,
          quantity: 1,
          unitPrice: price,
          tax,
          discount: 0,
          total
        }
      ],
      createdAt: now.toISOString()
    };
    this.invoices.set(newInvoice.id, newInvoice);

    // Audit Log
    this.addBillingAuditLog(tenant.id, 'PLAN_UPGRADE', actor, `Upgraded from [${oldPlanId}] to [${newPlanId}]`, {
      from: oldPlanId,
      to: newPlanId,
      cycle: billingCycle,
      total
    });

    logger.info(`[SaaS Billing] Tenant ${tenant.id} upgraded to ${newPlanId}`);
    return { subscription: updatedSub, invoice: newInvoice };
  }

  /**
   * Downgrade Plan with Safe Limits Validation (Data Protection)
   */
  public downgradePlan(
    tenantId: string, 
    newPlanId: SaaSPlanId,
    actor: string = 'Merchant'
  ): { subscription: SaaSSubscription; warning?: string } {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    if (!tenant) throw new Error('المتجر غير موجود');

    const oldSub = this.subscriptions.get(tenant.id);
    const newPlan = SAAS_PLANS[newPlanId];
    if (!newPlan) throw new Error('الخطة غير صالحة');

    const currentUsage = this.getTenantUsage(tenant.id);
    let warning: string | undefined;

    // Graceful Limit Handling: Do NOT delete products, but warn if over limit
    if (newPlan.limits.products !== -1 && currentUsage.products.current > newPlan.limits.products) {
      warning = `تنبيه: عدد منتجاتك الحالية (${currentUsage.products.current}) يتجاوز الحد الأقصى للباقة الجديدة (${newPlan.limits.products}). سيتم الاحتفاظ بجميع منتجاتك الحالية ولكن لن تتمكن من إضافة منتجات جديدة حتى يتم تعديل العدد.`;
    }

    const now = new Date();
    const updatedSub: SaaSSubscription = {
      ...(oldSub || {
        id: `sub-${tenant.id}`,
        tenantId: tenant.id,
        billingCycle: 'monthly',
        provider: 'mock_system',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: new Date(now.getTime() + 30 * 86400000).toISOString(),
        createdAt: now.toISOString()
      }),
      planId: newPlanId,
      status: 'active',
      updatedAt: now.toISOString()
    };
    this.subscriptions.set(tenant.id, updatedSub);

    db.updateTenant(tenant.id, {
      plan: newPlanId as any,
      lifecycleState: 'ACTIVE'
    });

    this.addBillingAuditLog(tenant.id, 'PLAN_DOWNGRADE', actor, `Downgraded to [${newPlanId}]. ${warning || ''}`, {
      from: oldSub?.planId,
      to: newPlanId,
      warning
    });

    return { subscription: updatedSub, warning };
  }

  /**
   * Cancel Subscription (End-of-Period or Immediate)
   */
  public cancelSubscription(tenantId: string, reason?: string, actor: string = 'Merchant'): SaaSSubscription {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    if (!tenant) throw new Error('المتجر غير موجود');

    const sub = this.subscriptions.get(tenant.id);
    if (!sub) throw new Error('الاشتراك غير موجود');

    const now = new Date().toISOString();
    sub.status = 'cancelled';
    sub.cancelledAt = now;
    sub.cancelAt = sub.currentPeriodEnd;
    sub.updatedAt = now;

    db.updateTenant(tenant.id, {
      subscriptionStatus: 'cancelled',
      lifecycleState: 'CANCELLED'
    });

    this.addBillingAuditLog(tenant.id, 'PLAN_CANCEL', actor, reason || 'Merchant requested cancellation', {
      cancelledAt: now,
      accessUntil: sub.currentPeriodEnd
    });

    return sub;
  }

  /**
   * Reactivate Subscription
   */
  public reactivateSubscription(tenantId: string, actor: string = 'Merchant'): SaaSSubscription {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    if (!tenant) throw new Error('المتجر غير موجود');

    const sub = this.subscriptions.get(tenant.id);
    if (!sub) throw new Error('لا يوجد اشتراك سابق');

    const now = new Date().toISOString();
    sub.status = 'active';
    sub.cancelledAt = undefined;
    sub.cancelAt = undefined;
    sub.updatedAt = now;

    db.updateTenant(tenant.id, {
      status: 'active',
      subscriptionStatus: 'active',
      billingStatus: 'good_standing',
      storeOperationalStatus: 'live',
      lifecycleState: 'ACTIVE'
    });

    this.addBillingAuditLog(tenant.id, 'PLAN_REACTIVATE', actor, 'Subscription reactivated', {});
    return sub;
  }

  /**
   * Trigger Grace Period on Payment Failure (7 Days Window)
   */
  public handlePaymentFailure(tenantId: string, invoiceId?: string): void {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    if (!tenant) return;

    const sub = this.subscriptions.get(tenant.id);
    if (sub) {
      sub.status = 'past_due';
      sub.updatedAt = new Date().toISOString();
    }

    db.updateTenant(tenant.id, {
      billingStatus: 'in_grace_period',
      lifecycleState: 'GRACE_PERIOD',
      storeOperationalStatus: 'live' // Store remains open during grace period!
    });

    this.addBillingAuditLog(tenant.id, 'GRACE_PERIOD_STARTED', 'System/BillingWebhook', 'Payment failed, 7-day grace period started', {
      invoiceId
    });
  }

  /**
   * Suspend Tenant after Grace Period Expired
   */
  public suspendTenant(tenantId: string, reason: string = 'Unpaid invoice after grace period', actor: string = 'System'): void {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    if (!tenant) return;

    db.updateTenant(tenant.id, {
      status: 'suspended',
      billingStatus: 'delinquent',
      lifecycleState: 'SUSPENDED',
      storeOperationalStatus: 'checkout_disabled' // Storefront read-only, checkout disabled, dashboard accessible
    });

    this.addBillingAuditLog(tenant.id, 'TENANT_SUSPENDED', actor, reason, {});
  }

  // -------------------------------------------------------------
  // 5. Invoicing & ZATCA QR Code Engine
  // -------------------------------------------------------------
  public getInvoices(tenantId?: string): SaaSInvoice[] {
    const all = Array.from(this.invoices.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (!tenantId) return all;
    const tenant = db.getTenantByIdOrSlug(tenantId);
    const resolvedTenantId = tenant ? tenant.id : tenantId;
    return all.filter(i => i.tenantId === resolvedTenantId);
  }

  public getInvoiceById(invoiceId: string): SaaSInvoice | undefined {
    return this.invoices.get(invoiceId);
  }

  public payInvoice(invoiceId: string): SaaSInvoice {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) throw new Error('الفاتورة غير موجودة');

    invoice.status = 'paid';
    invoice.paidAt = new Date().toISOString();

    // Re-activate tenant if it was delinquent
    db.updateTenant(invoice.tenantId, {
      billingStatus: 'good_standing',
      status: 'active',
      storeOperationalStatus: 'live',
      lifecycleState: 'ACTIVE'
    });

    this.addBillingAuditLog(invoice.tenantId, 'INVOICE_PAID', 'Merchant/Gateway', `Paid invoice ${invoice.invoiceNumber}`, {
      amount: invoice.total
    });

    return invoice;
  }

  /**
   * ZATCA (FATOORA) Standard TLV QR Code Generator
   */
  public generateZatcaQr(
    sellerName: string, 
    vatNumber: string, 
    timestamp: string, 
    total: number, 
    vatTotal: number
  ): string {
    const encodeTlv = (tag: number, value: string): Buffer => {
      const valBuf = Buffer.from(value, 'utf8');
      const tagBuf = Buffer.from([tag]);
      const lenBuf = Buffer.from([valBuf.length]);
      return Buffer.concat([tagBuf, lenBuf, valBuf]);
    };

    const tlv1 = encodeTlv(1, sellerName);
    const tlv2 = encodeTlv(2, vatNumber);
    const tlv3 = encodeTlv(3, timestamp);
    const tlv4 = encodeTlv(4, total.toFixed(2));
    const tlv5 = encodeTlv(5, vatTotal.toFixed(2));

    const combined = Buffer.concat([tlv1, tlv2, tlv3, tlv4, tlv5]);
    return combined.toString('base64');
  }

  // -------------------------------------------------------------
  // 6. Domain Management Subsystem
  // -------------------------------------------------------------
  public getDomains(tenantId: string): DomainRecord[] {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    const resolvedTenantId = tenant ? tenant.id : tenantId;
    return Array.from(this.domains.values()).filter(d => d.tenantId === resolvedTenantId);
  }

  public addCustomDomain(tenantId: string, hostname: string): DomainRecord {
    this.assertEntitlement(tenantId, 'custom_domain');
    const tenant = db.getTenantByIdOrSlug(tenantId);
    if (!tenant) throw new Error('المتجر غير موجود');

    const cleanHost = hostname.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!cleanHost.includes('.')) {
      throw new Error('اسم النطاق غير صالح. يجب أن يحتوي على اسم ونطاق علوي مثل: www.mystore.sa');
    }

    // Check duplicate
    const existing = Array.from(this.domains.values()).find(d => d.hostname === cleanHost);
    if (existing && existing.tenantId !== tenant.id) {
      throw new Error('هذا النطاق مستخدم بالفعل من قبل متجر آخر في المنصة.');
    }

    const newDomain: DomainRecord = {
      id: `dom-${Date.now()}`,
      tenantId: tenant.id,
      hostname: cleanHost,
      type: 'custom_domain',
      status: 'pending',
      verificationMethod: 'cname',
      verificationToken: `cos-verify-${crypto.randomBytes(6).toString('hex')}`,
      sslStatus: 'provisioning',
      isPrimary: false,
      cnameTarget: 'stores.commerceos.app',
      createdAt: new Date().toISOString()
    };

    this.domains.set(newDomain.id, newDomain);
    return newDomain;
  }

  public verifyDomain(domainId: string): DomainRecord {
    const domain = this.domains.get(domainId);
    if (!domain) throw new Error('سجل النطاق غير موجود');

    // Simulate DNS check & SSL certificate provisioning
    domain.status = 'verified';
    domain.verifiedAt = new Date().toISOString();
    domain.sslStatus = 'active';

    // Update tenant custom domain
    db.updateTenant(domain.tenantId, {
      customDomain: domain.hostname,
      customDomainVerified: true
    });

    this.addBillingAuditLog(domain.tenantId, 'DOMAIN_VERIFIED', 'DNS Simulator', `Domain ${domain.hostname} verified and SSL activated`, {});
    return domain;
  }

  public setPrimaryDomain(tenantId: string, domainId: string): DomainRecord {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    if (!tenant) throw new Error('المتجر غير موجود');

    const domains = this.getDomains(tenant.id);
    const target = domains.find(d => d.id === domainId);
    if (!target) throw new Error('النطاق غير موجود');
    if (target.status !== 'verified') throw new Error('لا يمكن تعيين نطاق غير مفحوص كنطاق رئيسي.');

    for (const d of domains) {
      d.isPrimary = d.id === domainId;
    }

    db.updateTenant(tenant.id, {
      customDomain: target.hostname,
      domain: target.hostname
    });

    return target;
  }

  public deleteDomain(tenantId: string, domainId: string): boolean {
    const domain = this.domains.get(domainId);
    if (!domain) return false;
    this.domains.delete(domainId);
    return true;
  }

  // -------------------------------------------------------------
  // 7. API Keys & Merchant Webhooks Subsystem
  // -------------------------------------------------------------
  public getApiKeys(tenantId: string): ApiKeyRecord[] {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    const resolved = tenant ? tenant.id : tenantId;
    return Array.from(this.apiKeys.values()).filter(k => k.tenantId === resolved && !k.revokedAt);
  }

  public createApiKey(tenantId: string, name: string, scopes: string[]): { apiKey: ApiKeyRecord; rawSecretKey: string } {
    this.assertEntitlement(tenantId, 'api_access');
    const tenant = db.getTenantByIdOrSlug(tenantId);
    if (!tenant) throw new Error('المتجر غير موجود');

    const randomBytes = crypto.randomBytes(24).toString('hex');
    const rawSecretKey = `sk_live_${tenant.slug}_${randomBytes}`;
    const prefix = `sk_live_${tenant.slug}_${randomBytes.substring(0, 6)}...`;
    const keyHash = crypto.createHash('sha256').update(rawSecretKey).digest('hex');

    const record: ApiKeyRecord = {
      id: `key-${Date.now()}`,
      tenantId: tenant.id,
      name,
      prefix,
      keyHash,
      scopes: scopes.length > 0 ? scopes : ['products:read', 'orders:read'],
      createdAt: new Date().toISOString()
    };

    this.apiKeys.set(record.id, record);
    return { apiKey: record, rawSecretKey };
  }

  public revokeApiKey(tenantId: string, keyId: string): boolean {
    const key = this.apiKeys.get(keyId);
    if (!key || key.tenantId !== tenantId) return false;
    key.revokedAt = new Date().toISOString();
    return true;
  }

  public getMerchantWebhooks(tenantId: string): MerchantWebhookEndpoint[] {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    const resolved = tenant ? tenant.id : tenantId;
    return Array.from(this.webhooks.values()).filter(w => w.tenantId === resolved);
  }

  public getWebhookDeliveries(tenantId: string): MerchantWebhookDelivery[] {
    const tenant = db.getTenantByIdOrSlug(tenantId);
    const resolved = tenant ? tenant.id : tenantId;
    return Array.from(this.webhookDeliveries.values())
      .filter(d => d.tenantId === resolved)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50);
  }

  public createMerchantWebhook(tenantId: string, name: string, url: string, events: string[]): MerchantWebhookEndpoint {
    this.assertEntitlement(tenantId, 'webhooks');
    const tenant = db.getTenantByIdOrSlug(tenantId);
    if (!tenant) throw new Error('المتجر غير موجود');

    const secret = `whsec_${crypto.randomBytes(20).toString('hex')}`;
    const endpoint: MerchantWebhookEndpoint = {
      id: `wh-${Date.now()}`,
      tenantId: tenant.id,
      name,
      url,
      secret,
      events: events.length > 0 ? events : ['order.created', 'order.paid'],
      isActive: true,
      failureCount: 0,
      createdAt: new Date().toISOString()
    };

    this.webhooks.set(endpoint.id, endpoint);
    return endpoint;
  }

  public dispatchMerchantWebhook(tenantId: string, event: string, payload: any): MerchantWebhookDelivery[] {
    const matchingEndpoints = Array.from(this.webhooks.values()).filter(
      w => w.tenantId === tenantId && w.isActive && (w.events.includes(event) || w.events.includes('*'))
    );

    const results: MerchantWebhookDelivery[] = [];
    const now = new Date().toISOString();

    for (const ep of matchingEndpoints) {
      const payloadString = JSON.stringify(payload);
      const signature = crypto.createHmac('sha256', ep.secret).update(payloadString).digest('hex');

      const delivery: MerchantWebhookDelivery = {
        id: `deliv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        webhookId: ep.id,
        tenantId,
        event,
        payload,
        status: 'delivered',
        httpStatusCode: 200,
        responseBody: JSON.stringify({ received: true, status: 'OK' }),
        durationMs: Math.floor(45 + Math.random() * 80),
        attemptNumber: 1,
        signature: `t=${Date.now()},v1=${signature}`,
        createdAt: now
      };

      this.webhookDeliveries.set(delivery.id, delivery);
      ep.lastTriggeredAt = now;
      results.push(delivery);
    }

    return results;
  }

  public retryWebhookDelivery(deliveryId: string): MerchantWebhookDelivery {
    const delivery = this.webhookDeliveries.get(deliveryId);
    if (!delivery) throw new Error('سجل الإرسال غير موجود');

    delivery.attemptNumber += 1;
    delivery.status = 'delivered';
    delivery.httpStatusCode = 200;
    delivery.responseBody = JSON.stringify({ received: true, retried: true, timestamp: new Date().toISOString() });
    delivery.durationMs = Math.floor(30 + Math.random() * 50);

    return delivery;
  }

  // -------------------------------------------------------------
  // 8. Idempotent Inbound Billing Webhook Handler (Stripe / Moyasar)
  // -------------------------------------------------------------
  public handleInboundBillingWebhook(eventId: string, eventType: string, payload: any): { success: boolean; message: string } {
    if (this.processedWebhookEvents.has(eventId)) {
      return { success: true, message: `Idempotent duplicate ignored: event ${eventId} already processed.` };
    }

    this.processedWebhookEvents.add(eventId);

    logger.info(`[Billing Webhook] Processing ${eventType} (${eventId})`);

    const tenantId = payload.tenantId || payload.metadata?.tenantId;
    if (!tenantId) {
      return { success: true, message: 'Webhook received without tenant mapping.' };
    }

    switch (eventType) {
      case 'invoice.paid':
      case 'subscription.created':
        this.payInvoice(payload.invoiceId || `inv-${tenantId}`);
        break;
      case 'invoice.payment_failed':
        this.handlePaymentFailure(tenantId, payload.invoiceId);
        break;
      case 'subscription.cancelled':
        this.cancelSubscription(tenantId, 'Cancelled via billing provider portal', 'ProviderWebhook');
        break;
      default:
        logger.info(`[Billing Webhook] Unhandled event type: ${eventType}`);
    }

    return { success: true, message: `Event ${eventType} successfully processed.` };
  }

  // -------------------------------------------------------------
  // 9. Platform SaaS Metrics & Analytics
  // -------------------------------------------------------------
  public getPlatformBillingAnalytics(): SaaSPlatformMetrics {
    const allSubs = Array.from(this.subscriptions.values());
    const allTenants = db.getTenants();

    let mrr = 0;
    let activeTenantsCount = 0;
    let trialTenantsCount = 0;
    let pastDueTenantsCount = 0;

    for (const sub of allSubs) {
      const plan = SAAS_PLANS[sub.planId] || SAAS_PLANS.starter;
      if (sub.status === 'active') {
        activeTenantsCount += 1;
        mrr += sub.billingCycle === 'yearly' ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice;
      } else if (sub.status === 'trialing') {
        trialTenantsCount += 1;
      } else if (sub.status === 'past_due') {
        pastDueTenantsCount += 1;
      }
    }

    const arr = mrr * 12;
    const totalSubscribersCount = activeTenantsCount + trialTenantsCount;
    const arpu = activeTenantsCount > 0 ? Math.round(mrr / activeTenantsCount) : 0;
    const ltv = arpu * 18; // Average 18-month customer lifecycle
    const churnRate = 2.4; // 2.4% monthly churn
    const trialConversionRate = 34.5; // 34.5% conversion

    return {
      mrr,
      arr,
      arpu,
      ltv,
      churnRate,
      trialConversionRate,
      activeTenantsCount: Math.max(activeTenantsCount, allTenants.filter(t => t.status === 'active').length),
      trialTenantsCount: Math.max(trialTenantsCount, allTenants.filter(t => t.status === 'trial').length),
      pastDueTenantsCount,
      totalSubscribersCount,
      expansionRevenue: Math.round(mrr * 0.18),
      retentionRate: 97.6
    };
  }

  // -------------------------------------------------------------
  // 10. Manual Admin Override & Audit Trail
  // -------------------------------------------------------------
  public addBillingAuditLog(
    tenantId: string, 
    action: BillingAuditLogRecord['action'], 
    actor: string, 
    reason: string = '', 
    details: any = {}
  ) {
    const record: BillingAuditLogRecord = {
      id: `baudit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      tenantId,
      action,
      actor,
      reason,
      beforeState: details.from || {},
      afterState: details.to || details,
      timestamp: new Date().toISOString()
    };
    this.billingAuditLogs.unshift(record);
    if (this.billingAuditLogs.length > 500) {
      this.billingAuditLogs = this.billingAuditLogs.slice(0, 500);
    }
  }

  public getBillingAuditLogs(tenantId?: string): BillingAuditLogRecord[] {
    if (!tenantId) return this.billingAuditLogs;
    return this.billingAuditLogs.filter(l => l.tenantId === tenantId);
  }

  public adminManualOverride(
    tenantId: string, 
    overrideType: 'plan' | 'quotas' | 'status' | 'trial_extension', 
    value: any, 
    actor: string, 
    reason: string
  ): boolean {
    if (!reason || reason.trim().length < 5) {
      throw new Error('التعديل الإداري اليدوي يتطلب كتابة سبب صريح ومفصل لأغراض التدقيق والرقابة (Audit Compliance).');
    }

    const tenant = db.getTenantByIdOrSlug(tenantId);
    if (!tenant) throw new Error('المتجر غير موجود');

    const beforeState = { plan: tenant.plan, status: tenant.status, quotas: tenant.quotas };

    if (overrideType === 'plan') {
      const planId = value as SaaSPlanId;
      if (!SAAS_PLANS[planId]) throw new Error('الخطة غير صالحة');
      const sub = this.subscriptions.get(tenant.id);
      if (sub) {
        sub.planId = planId;
        sub.updatedAt = new Date().toISOString();
      }
      db.updateTenant(tenant.id, { plan: planId as any });
    } else if (overrideType === 'status') {
      const status = value as 'active' | 'suspended' | 'trial';
      db.updateTenant(tenant.id, { status });
    } else if (overrideType === 'quotas') {
      db.updateTenant(tenant.id, { quotas: { ...tenant.quotas, ...value } });
    }

    this.addBillingAuditLog(tenant.id, 'MANUAL_QUOTA_OVERRIDE', actor, reason, {
      from: beforeState,
      to: value,
      type: overrideType
    });

    return true;
  }
}

export const saasBillingService = new SaaSBillingEngine();
