import { Category, Coupon, Customer, Order, Product, StaffMember, SubscriptionPlan, TenantStore } from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    nameAr: 'الباقة الأساسية',
    price: 199,
    billingCycle: 'monthly',
    limits: {
      products: 100,
      staff: 2,
      themes: 'Standard',
      customDomain: false,
      analytics: 'basic',
      api: false,
      whiteLabel: false
    }
  },
  {
    id: 'business',
    name: 'Business Plan',
    nameAr: 'باقة الأعمال',
    price: 499,
    billingCycle: 'monthly',
    limits: {
      products: 1000,
      staff: 6,
      themes: 'Full Library',
      customDomain: true,
      analytics: 'advanced',
      api: false,
      whiteLabel: false
    }
  },
  {
    id: 'pro',
    name: 'Professional Plan',
    nameAr: 'الباقة الاحترافية',
    price: 899,
    billingCycle: 'monthly',
    limits: {
      products: -1, // unlimited
      staff: 16,
      themes: 'Premium & Custom',
      customDomain: true,
      analytics: 'advanced',
      api: true,
      whiteLabel: true
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    nameAr: 'باقة المؤسسات',
    price: 1899,
    billingCycle: 'monthly',
    limits: {
      products: -1,
      staff: 50,
      themes: 'Bespoke Custom',
      customDomain: true,
      analytics: 'advanced',
      api: true,
      whiteLabel: true
    }
  }
];

// Zero-State Initial Entities (No fake demo stores or products in production)
export const INITIAL_TENANTS: TenantStore[] = [];
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_CATEGORIES: Category[] = [];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_CUSTOMERS: Customer[] = [];
export const INITIAL_COUPONS: Coupon[] = [];
export const INITIAL_STAFF: StaffMember[] = [];
