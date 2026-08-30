export type BusinessType = 
  | 'honey' 
  | 'coffee' 
  | 'fashion' 
  | 'perfume' 
  | 'tech' 
  | 'beauty' 
  | 'sweets' 
  | 'accessories' 
  | 'food' 
  | 'general';

export type ThemeStyle = 'luxury' | 'modern' | 'minimal' | 'organic' | 'bold' | 'classic' | 'editorial';
export type ThemeLayout = 'classic' | 'modern' | 'editorial' | 'marketplace' | 'luxury' | 'bento' | 'minimalist';
export type RadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type FontFamily = 
  | 'tajawal' 
  | 'alexandria' 
  | 'cairo' 
  | 'readex' 
  | 'almarai' 
  | 'ibm_plex' 
  | 'el_messiri' 
  | 'amiri' 
  | 'playfair' 
  | 'jakarta';

export interface DesignTokens {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
}

export interface StoreTheme {
  style: ThemeStyle;
  layout: ThemeLayout;
  fontFamily: FontFamily;
  radius: RadiusPreset;
  shadow: 'none' | 'subtle' | 'soft' | 'dramatic';
  headerStyle: 'floating' | 'solid' | 'transparent' | 'centered_logo' | 'island_blur';
  heroStyle?: 'split' | 'cinematic' | 'story' | 'spotlight' | 'minimal';
  cardStyle: 'elevated' | 'bordered' | 'minimal' | 'glass';
  tokens: DesignTokens;
  darkMode: boolean;
}

export interface HomepageSection {
  id: string;
  type: 'hero' | 'categories' | 'featured_products' | 'benefits' | 'banner' | 'testimonials' | 'faq' | 'story' | 'newsletter';
  title: string;
  titleEn: string;
  subtitle?: string;
  subtitleEn?: string;
  enabled: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  nameEn?: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn?: string;
  categoryId: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku: string;
  barcode?: string;
  stock: number;
  lowStockAlert: number;
  images: string[];
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  weight?: string;
  attributes?: {
    name: string;
    values: string[];
  }[];
  variants?: ProductVariant[];
  tags: string[];
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  nameEn: string;
  icon?: string;
  image?: string;
  productCount?: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantName?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderTimeline {
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  tenantId: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    city: string;
    address: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 
    | 'mada' 
    | 'apple_pay' 
    | 'visa' 
    | 'stc_pay' 
    | 'urpay' 
    | 'tamara' 
    | 'tabby' 
    | 'knet' 
    | 'benefit' 
    | 'fawry' 
    | 'cliq' 
    | 'cod' 
    | 'bank_transfer';
  paymentStatus: 'paid' | 'pending' | 'pending_verification' | 'failed';
  bankTransferDetails?: {
    bankName: string;
    accountHolder: string;
    accountNumber?: string;
    iban?: string;
    receiptImage?: string;
    transferDate: string;
    referenceNumber?: string;
  };
  createdAt: string;
  notes?: string;
  timeline: OrderTimeline[];
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  tags: string[];
  status: 'active' | 'vip' | 'inactive';
}

export interface Coupon {
  id: string;
  tenantId: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
  usageLimit?: number;
  usageCount: number;
  expiresAt: string;
  isActive: boolean;
}

export type IdentityType = 'platform_admin' | 'tenant_staff' | 'customer';

export type PlatformAdminRole = 'platform_super_admin' | 'platform_auditor';

export type StaffRole = 
  | 'store_owner' 
  | 'store_admin' 
  | 'product_manager' 
  | 'order_manager' 
  | 'inventory_manager' 
  | 'marketing_manager' 
  | 'support_agent';

export interface StaffPermissions {
  products: boolean;
  orders: boolean;
  customers: boolean;
  inventory: boolean;
  coupons: boolean;
  theme: boolean;
  staff: boolean;
  settings: boolean;
  reports: boolean;
}

export interface StaffMember {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  avatar?: string;
  role: StaffRole;
  permissions: StaffPermissions;
  status: 'active' | 'invited';
  createdAt: string;
  passwordHash?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  identityType?: IdentityType;
  role: StaffRole | PlatformAdminRole | 'customer';
  tenantId?: string;
  permissions?: StaffPermissions;
}

export type SubscriptionPlanId = 'starter' | 'business' | 'pro' | 'enterprise';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  nameAr: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  limits: {
    products: number; // -1 for unlimited
    staff: number;
    themes: string;
    customDomain: boolean;
    analytics: 'basic' | 'advanced';
    api: boolean;
    whiteLabel: boolean;
  };
}

export type PageBlockType = 'hero_banner' | 'categories_grid' | 'products_grid' | 'testimonials' | 'text_image' | 'features_grid' | 'newsletter' | 'faq_accordion';

export interface PageBlock {
  id: string;
  type: PageBlockType;
  title: string;
  enabled: boolean;
  order: number;
  config: {
    heading?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    showButton?: boolean;
    backgroundImage?: string;
    layoutStyle?: 'grid' | 'carousel' | 'masonry';
    columns?: number;
    content?: string;
    alignment?: 'right' | 'center' | 'left';
  };
}

export interface StorePageItem {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  type: 'home' | 'products' | 'about' | 'contact' | 'faq' | 'privacy' | 'refund' | 'blog' | 'custom';
  enabled: boolean;
  isDefault?: boolean;
  blocks?: PageBlock[];
}

export interface TenantStore {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn?: string;
  businessType: BusinessType;
  logo: string;
  logoIcon?: string;
  slogan?: string;
  sloganEn?: string;
  currency: string;
  currencySymbol: string;
  domain: string;
  customDomain?: string;
  customDomainVerified?: boolean;
  plan: SubscriptionPlanId;
  status: 'active' | 'suspended' | 'trial';
  createdAt: string;
  contact: {
    email: string;
    phone: string;
    whatsapp?: string;
    city: string;
    country: string;
  };
  social: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    snapchat?: string;
  };
  theme: StoreTheme;
  sections: HomepageSection[];
  pwaConfig: {
    appName: string;
    shortName: string;
    themeColor: string;
    backgroundColor: string;
    enablePush: boolean;
  };
  paymentGateways: {
    mada: boolean;
    applePay: boolean;
    visa: boolean;
    stcPay?: boolean;
    urpay?: boolean;
    tamara: boolean;
    tabby?: boolean;
    knet?: boolean;
    benefit?: boolean;
    fawry?: boolean;
    cliq?: boolean;
    cod: boolean;
    bankTransfer: boolean;
  };
  bankAccounts?: BankAccount[];
  appDownloadConfig?: {
    appName: string;
    packageName: string;
    bundleId: string;
    pwaEnabled: boolean;
    androidApkReady: boolean;
    iosReady: boolean;
    version: string;
  };
  shippingMethods: {
    id: string;
    name: string;
    nameEn: string;
    cost: number;
    estimatedDays: string;
    active: boolean;
  }[];
  taxConfig?: {
    enabled: boolean;
    rate: number; // e.g. 15 for 15% VAT
    taxNumber?: string;
    taxIncludedInPrice: boolean;
  };
  pages?: StorePageItem[];
  licensing?: TenantLicensing;
  quotas?: TenantQuotas;
}

export type LicenseTier = 'free' | 'white_label_single' | 'agency_sovereign';

export interface TenantLicensing {
  tier: LicenseTier;
  licenseKey?: string;
  isWhiteLabel: boolean;
  issuedAt?: string;
  expiresAt?: string;
  signature?: string;
  verified: boolean;
  watermarkIntegrityHash?: string;
  customBranding?: {
    removeCommerceOSFooter: boolean;
    customFooterText?: string;
    customPoweredBy?: string;
    customPoweredByUrl?: string;
    hideWatermarkInExports: boolean;
  };
  tamperAttemptsCount?: number;
  lastTamperDetectedAt?: string;
}

export interface TenantQuotas {
  maxProducts: number; // -1 for unlimited
  maxStaff: number;
  maxMonthlyBuilds: number;
  usedMonthlyBuilds: number;
  allowCustomDomain: boolean;
  allowDockerSelfHost: boolean;
  allowNativeIosAndroid: boolean;
  storageQuotaMb: number;
  usedStorageMb: number;
}

export interface PlatformLicensingConfig {
  whiteLabelSingleStorePrice: number; // in SAR e.g. 189
  agencySovereignMonthlyPrice: number; // in SAR e.g. 749
  agencySovereignLifetimePrice: number; // in SAR e.g. 2490
  watermarkEnforcement: 'strict_tamper_lock' | 'soft_warning' | 'disabled';
  obfuscationLevel: 'high_ast_xor' | 'standard_base64' | 'none';
  allowOneClickActivation: boolean;
  superAdminEmail: string;
  tamperLog: TamperEventLog[];
}

export interface TamperEventLog {
  id: string;
  tenantId: string;
  tenantName: string;
  detectedAt: string;
  tamperType: 'dom_removal' | 'css_hiding' | 'script_injection' | 'integrity_hash_mismatch';
  actionTaken: 'checkout_locked' | 'watermark_reinstated' | 'warning_logged';
  ipAddress?: string;
  userAgent?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  iban: string;
  isActive?: boolean;
  active?: boolean;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

// ==========================================
// CommerceOS Build & Publish Engine Types
// ==========================================

export type DeliveryTarget = 'web' | 'pwa' | 'android' | 'ios' | 'self_hosted' | 'desktop';

export type BuildTargetStatus = 'published' | 'active' | 'generated' | 'building' | 'ready' | 'draft';

export interface GeneratedAssetItem {
  id: string;
  name: string;
  platform: 'web' | 'android' | 'ios' | 'pwa';
  dimensions: string;
  purpose: string;
  dataUrl?: string;
}

export interface AppIdentityConfig {
  appName: string;
  shortName: string;
  packageName: string; // e.g. com.elitehoney.app
  bundleId: string;    // e.g. com.elitehoney.store
  version: string;     // e.g. 1.4.0
  buildNumber: number; // e.g. 18
  primaryColor: string;
  splashBackgroundColor: string;
  serverUrl: string;   // e.g. https://elite-honey.commerceos.app
  apiUrl: string;      // e.g. https://api.commerceos.app/v1
  enablePush: boolean;
  enableBiometrics: boolean;
  enableOfflineCache: boolean;
  enableCameraPermission: boolean;
}

export interface BuildArtifact {
  id: string;
  tenantId: string;
  target: DeliveryTarget;
  targetName: string;
  version: string;
  buildNumber: number;
  status: 'building' | 'succeeded' | 'failed' | 'queued' | 'processing';
  createdAt: string;
  fileSize: string;
  fileName: string;
  downloadUrl: string;
  commitHash: string;
  buildDurationSec: number;
  logs: string[];
  configSnapshot?: Partial<AppIdentityConfig>;
  workerNodeId?: string;
  queuePosition?: number;
  cpuUsagePercent?: number;
  ramUsageMb?: number;
  progressPercent?: number;
}

export interface BuildWorkerNode {
  id: string;
  name: string;
  region: string;
  status: 'idle' | 'busy' | 'scaling' | 'offline';
  currentJobId?: string;
  currentTenantName?: string;
  currentStage?: string;
  cpuLoad: number; // 0 to 100%
  ramLoad: number; // 0 to 100%
  completedJobsCount: number;
  activeTarget?: DeliveryTarget;
  uptimeHours: number;
  ip: string;
}

export interface BuildJobQueueItem {
  id: string;
  tenantId: string;
  tenantName: string;
  target: DeliveryTarget;
  targetName: string;
  version: string;
  buildNumber: number;
  status: 'queued' | 'claimed' | 'compiling' | 'bundling' | 'signing' | 'ready' | 'failed';
  priority: 'vip_enterprise' | 'growth' | 'standard';
  progress: number; // 0 to 100
  currentStep: string;
  queuedAt: string;
  startedAt?: string;
  completedAt?: string;
  workerId?: string;
  workerName?: string;
  estimatedRemainingSec: number;
  logs: string[];
  outputArtifact?: BuildArtifact;
}

export interface BuildFarmMetrics {
  totalWorkers: number;
  activeWorkers: number;
  idleWorkers: number;
  queuedJobsCount: number;
  activeJobsCount: number;
  completedTodayCount: number;
  avgBuildTimeSec: number;
  totalCpuCapacityCores: number;
  usedCpuPercentage: number;
  redisQueueHealth: 'optimal' | 'degraded' | 'overloaded';
  redisMemoryUsageMb: number;
  socketConnectionsCount: number;
}

export interface TargetDetails {
  target: DeliveryTarget;
  titleAr: string;
  titleEn: string;
  status: BuildTargetStatus;
  statusLabelAr: string;
  lastBuildDate?: string;
  currentVersion: string;
  currentBuildNumber: number;
  primaryActionLabelAr: string;
  secondaryActionLabelAr?: string;
  exportFormat: string;
}

// ==========================================
// Visual IDE & Zero-Domain Engine Types
// ==========================================

export type VisualBlockType = 
  | 'hero_banner' 
  | 'categories_slider' 
  | 'product_grid' 
  | 'flash_sale' 
  | 'features_bar' 
  | 'testimonials' 
  | 'faq_accordion' 
  | 'newsletter' 
  | 'footer';

export interface VisualBlock {
  id: string;
  type: VisualBlockType;
  nameAr: string;
  nameEn: string;
  enabled: boolean;
  order: number;
  props: Record<string, any>;
}

export interface VisualIDETemplate {
  id: string;
  name: string;
  industry: string;
  previewUrl: string;
  blocks: VisualBlock[];
  themeTokens: Record<string, string>;
}

// ==========================================
// Financial Engine, Payment & Webhook Security Types
// ==========================================

export type PaymentIntentStatus = 
  | 'PENDING' 
  | 'AUTHORIZED' 
  | 'PAID' 
  | 'FAILED' 
  | 'CANCELLED' 
  | 'REFUNDED' 
  | 'PARTIALLY_REFUNDED';

export type PaymentAttemptStatus = 
  | 'PENDING' 
  | 'AUTHORIZED' 
  | 'CAPTURED' 
  | 'FAILED' 
  | 'REFUNDED' 
  | 'VOIDED';

export type RefundStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED';

export interface PaymentIntent {
  id: string;
  tenantId: string;
  orderId: string;
  amount: number;
  currency: string;
  provider: 'moyasar' | 'tap' | 'tamara' | 'tabby' | 'hyperpay' | 'stripe' | 'bank_transfer' | 'cod' | string;
  status: PaymentIntentStatus;
  clientSecret: string;
  capturedAmount: number;
  refundedAmount: number;
  paymentMethod?: string;
  metadata?: Record<string, any>;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentAttempt {
  id: string;
  paymentIntentId: string;
  tenantId: string;
  orderId: string;
  transactionId?: string;
  provider: string;
  method: string;
  amount: number;
  currency: string;
  status: PaymentAttemptStatus;
  gatewayResponse?: any;
  failureReason?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface Refund {
  id: string;
  paymentIntentId: string;
  orderId: string;
  tenantId: string;
  transactionId?: string;
  gatewayRefundId?: string;
  amount: number;
  currency: string;
  reason: string;
  type: 'full' | 'partial';
  status: RefundStatus;
  initiatedBy: string;
  gatewayResponse?: any;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEventRecord {
  id: string;
  tenantId: string;
  gateway: 'tamara' | 'tabby' | 'moyasar' | 'tap' | 'hyperpay' | 'stripe' | 'custom' | string;
  eventId: string;
  eventType: string;
  signature?: string;
  payload: any;
  status: 'received' | 'processing' | 'verified' | 'processed' | 'rejected' | 'duplicate' | 'failed';
  orderId?: string;
  paymentIntentId?: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
  processingTimeMs?: number;
  errorMessage?: string;
  createdAt: string;
}

export interface WebhookLog {
  id: string;
  gateway: 'tamara' | 'tabby' | 'moyasar' | 'tap' | 'hyperpay' | 'stripe' | 'custom' | string;
  eventId: string;
  eventType: string;
  signature: string;
  verified: boolean;
  timestamp: string;
  payload: any;
  orderId?: string;
  status: 'processed' | 'rejected' | 'replay_detected' | 'failed';
  processingTimeMs: number;
  errorMessage?: string;
}

export interface AbandonedCart {
  id: string;
  tenantId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  currency: string;
  abandonedAt: string;
  recoveryStatus: 'abandoned' | 'notified' | 'recovered' | 'expired';
  recoveryAttempts: number;
  lastContactedAt?: string;
  discountCodeOffered?: string;
  recoveryUrl: string;
}

export interface NotificationLog {
  id: string;
  tenantId: string;
  channel: 'whatsapp' | 'sms' | 'email';
  recipient: string;
  recipientName: string;
  triggerEvent: 'order_created' | 'payment_confirmed' | 'order_shipped' | 'order_delivered' | 'cart_recovery';
  templateName: string;
  messageBody: string;
  status: 'sent' | 'delivered' | 'failed' | 'queued';
  sentAt: string;
  provider: 'twilio' | 'unifonic' | 'whatsapp_cloud_api' | 'sendgrid';
}

export interface CodeSigningConfig {
  android: {
    keystoreAlias: string;
    keystorePassword: string;
    keyPassword: string;
    validityYears: number;
    commonName: string;
    organization: string;
    countryCode: string;
  };
  ios: {
    teamId: string;
    bundleId: string;
    provisioningProfileType: 'development' | 'appstore' | 'ad_hoc' | 'enterprise';
    signingCertificateName: string;
    exportMethod: string;
  };
}

