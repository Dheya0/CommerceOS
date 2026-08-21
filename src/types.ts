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

export type ThemeStyle = 'luxury' | 'modern' | 'minimal' | 'organic' | 'bold' | 'classic';
export type ThemeLayout = 'classic' | 'modern' | 'editorial' | 'marketplace' | 'luxury';
export type RadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type FontFamily = 'alexandria' | 'tajawal' | 'playfair' | 'jakarta';

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
  headerStyle: 'floating' | 'solid' | 'transparent';
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
  paymentMethod: 'mada' | 'apple_pay' | 'visa' | 'cod' | 'tamara';
  paymentStatus: 'paid' | 'pending' | 'failed';
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
    cod: boolean;
    tamara: boolean;
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
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}
