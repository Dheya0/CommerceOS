import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  CartItem,
  Category,
  Coupon,
  Customer,
  Order,
  Product,
  ProductVariant,
  StaffMember,
  StaffRole,
  StoreTheme,
  TenantStore,
  PlatformLicensingConfig,
  TenantQuotas,
  TamperEventLog,
  AuthUser,
  BusinessType,
  DebtRecord,
  DebtTransaction,
  ExpenseRecord,
  POSReceipt
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_STAFF,
  INITIAL_TENANTS,
  INITIAL_DEBTS,
  INITIAL_EXPENSES
} from '../data/initialData';
import { api } from '../api/client';
import { DEFAULT_PLATFORM_CONFIG, validateLicenseKey, generateLicenseKey } from '../utils/licensingEngine';
import { generateDesignTokens } from '../utils/themeEngine';

export type AppView = 'home' | 'storefront' | 'merchant_dashboard' | 'builder_wizard' | 'platform_admin' | 'live_customizer' | 'visual_ide' | 'auth_page' | 'pricing' | 'design_system' | 'personal_profile' | 'no_code_studio';
export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface CommerceContextType {
  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  previewDevice: PreviewDevice;
  setPreviewDevice: (device: PreviewDevice) => void;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;

  // Active Tenant
  activeTenantId: string;
  setActiveTenantId: (id: string) => void;
  activeTenant: TenantStore;
  tenants: TenantStore[];

  // Authentication & Session
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, targetTenantId?: string) => Promise<boolean>;
  register: (data: { 
    name: string; 
    email: string; 
    phone?: string;
    password?: string; 
    storeName: string; 
    storeSlug: string; 
    businessType: BusinessType; 
    cleanStore?: boolean 
  }) => Promise<boolean>;
  logout: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  resetToCleanStore: (tenantId: string) => void;

  // RBAC Role Simulator
  currentStaffRole: StaffRole;
  setCurrentStaffRole: (role: StaffRole) => void;
  activeStaffPermissions: StaffMember['permissions'];

  // Data for Active Tenant
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  staff: StaffMember[];
  debts: DebtRecord[];
  expenses: ExpenseRecord[];

  // Cart & Commerce Flow
  cart: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, variantId: string | undefined, delta: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  productModal: Product | null;
  setProductModal: (product: Product | null) => void;

  // Server state sync
  isServerSyncing: boolean;
  refreshFromBackend: () => Promise<void>;

  // Actions
  createTenant: (newTenant: any, initialProducts?: Product[], initialCategories?: Category[]) => Promise<TenantStore>;
  cloneTenant: (tenantId: string) => Promise<TenantStore>;
  updateTenant: (tenantId: string, updates: Partial<TenantStore>) => void;
  deleteTenant: (tenantId: string) => void;
  updateTheme: (tenantId: string, theme: StoreTheme) => void;

  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;

  addOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status'], note?: string) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: Order['paymentStatus'], note?: string) => void;

  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (couponId: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (couponId: string) => void;

  addDebt: (debt: Omit<DebtRecord, 'id' | 'createdAt' | 'transactions' | 'status' | 'remainingAmount'>) => void;
  recordDebtPayment: (debtId: string, amount: number, paymentMethod: DebtTransaction['paymentMethod'], note?: string) => void;
  deleteDebt: (debtId: string) => void;

  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  deleteExpense: (expenseId: string) => void;

  addStaff: (staff: Omit<StaffMember, 'id' | 'createdAt'>) => void;
  updateStaff: (staffId: string, updates: Partial<StaffMember>) => void;
  deleteStaff: (staffId: string) => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // Licensing & Platform Super Admin Controls
  platformConfig: PlatformLicensingConfig;
  updatePlatformConfig: (updates: Partial<PlatformLicensingConfig>) => void;
  applyLicenseToTenant: (tenantId: string, licenseKey: string) => boolean;
  toggleWhiteLabel: (tenantId: string, enabled: boolean) => void;
  updateTenantStatus: (tenantId: string, status: 'active' | 'suspended' | 'trial') => void;
  updateTenantQuotas: (tenantId: string, quotas: Partial<TenantQuotas>) => void;
  logTamperEvent: (event: Omit<TamperEventLog, 'id' | 'detectedAt'>) => void;

  // Anti-Tamper Protection Modal
  tamperAlertModalOpen: boolean;
  setTamperAlertModalOpen: (open: boolean) => void;
  tamperModalData: { tenantName: string; reason: string; tamperCode?: string } | null;
  setTamperModalData: (data: { tenantName: string; reason: string; tamperCode?: string } | null) => void;
}

const CommerceContext = createContext<CommerceContextType | null>(null);

export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // View states
  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const savedUser = localStorage.getItem('commerceos_auth_user');
      if (savedUser) {
        return 'merchant_dashboard';
      }
    } catch {}
    return 'merchant_dashboard';
  });
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [activeTenantId, setActiveTenantId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('commerceos_active_tenant_id');
      return saved || 'store-royal-honey-oud';
    } catch {
      return 'store-royal-honey-oud';
    }
  });
  const [currentStaffRole, setCurrentStaffRole] = useState<StaffRole>('store_owner');
  const [isServerSyncing, setIsServerSyncing] = useState<boolean>(false);

  // Initialize with rich luxury Arab commerce datasets by default
  const [tenants, setTenants] = useState<TenantStore[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_tenants');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const uniqueMap = new Map<string, TenantStore>();
          parsed.forEach((t: any, idx: number) => {
            if (t) {
              const id = t.id || `tenant-${idx}`;
              if (!uniqueMap.has(id)) {
                uniqueMap.set(id, { ...t, id });
              }
            }
          });
          const list = Array.from(uniqueMap.values());
          if (list.length > 0) return list;
        }
      }
      return INITIAL_TENANTS;
    } catch {
      return INITIAL_TENANTS;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_customers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_coupons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_staff');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [debts, setDebts] = useState<DebtRecord[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_debts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_DEBTS;
    } catch {
      return INITIAL_DEBTS;
    }
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_expenses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  // Cart & UI modals
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [productModal, setProductModal] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Licensing & Platform Super Admin State
  const [platformConfig, setPlatformConfig] = useState<PlatformLicensingConfig>(() => {
    try {
      const saved = localStorage.getItem('commerceos_platform_config');
      return saved ? JSON.parse(saved) : DEFAULT_PLATFORM_CONFIG;
    } catch {
      return DEFAULT_PLATFORM_CONFIG;
    }
  });

  const [tamperAlertModalOpen, setTamperAlertModalOpen] = useState<boolean>(false);
  const [tamperModalData, setTamperModalData] = useState<{ tenantName: string; reason: string; tamperCode?: string } | null>(null);

  // Authentication & Session
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('commerceos_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const login = async (email: string, password?: string, targetTenantId?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const effectiveTenantId = targetTenantId || activeTenantId;

    if (!password) {
      showToast('يرجى إدخال كلمة المرور', 'error');
      return false;
    }

    try {
      const res = await api.login('store_owner', cleanEmail, password);
      if (res && res.user) {
        const user: AuthUser = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          tenantId: res.user.tenantId || effectiveTenantId,
          permissions: res.user.permissions
        };

        setCurrentUser(user);
        setCurrentStaffRole(res.user.role || 'store_owner');
        if (res.user.tenantId) {
          setActiveTenantId(res.user.tenantId);
          api.setTenant(res.user.tenantId);
        }

        try {
          localStorage.setItem('commerceos_auth_user', JSON.stringify(user));
        } catch {}

        setAuthModalOpen(false);
        setCurrentView('personal_profile');
        showToast(language === 'ar' ? `مرحباً بك ${user.name}! تم تسجيل الدخول بنجاح` : `Welcome ${user.name}! Signed in successfully`, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'فشل تسجيل الدخول، يرجى التحقق من البريد وكلمة المرور', 'error');
      return false;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password?: string;
  }): Promise<boolean> => {
    try {
      const res = await api.register(data.name, data.email, data.password);
      if (res && res.success) {
        showToast(language === 'ar' ? 'تم تسجيل الحساب بنجاح! بانتظار تفعيل البريد الإلكتروني.' : 'Account created successfully! Awaiting email verification.', 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || (language === 'ar' ? 'فشل تسجيل الحساب، يرجى المحاولة لاحقاً' : 'Registration failed, please try again'), 'error');
      return false;
    }
  };

  const logout = () => {
    api.logout().catch(() => {});
    setCurrentUser(null);
    try {
      localStorage.removeItem('commerceos_auth_user');
      localStorage.removeItem('cos_auth_token');
    } catch {}
    showToast('تم تسجيل الخروج بنجاح', 'info');
    setCurrentView('home');
  };

  const handleSetCurrentView = (view: AppView) => {
    const protectedViews: AppView[] = ['merchant_dashboard', 'builder_wizard', 'live_customizer', 'visual_ide', 'platform_admin', 'personal_profile'];
    if (protectedViews.includes(view) && !currentUser) {
      showToast('يرجى تسجيل الدخول أولاً للوصول إلى مساحة عملك الشخصية', 'warning');
      setCurrentView('auth_page');
      return;
    }
    setCurrentView(view);
  };

  const resetToCleanStore = (tenantId: string) => {
    setProducts(prev => prev.filter(p => p.tenantId !== tenantId));
    setCategories(prev => prev.filter(c => c.tenantId !== tenantId));
    setOrders(prev => prev.filter(o => o.tenantId !== tenantId));
    setCoupons(prev => prev.filter(cp => cp.tenantId !== tenantId));
    showToast('تم مسح كافة البيانات الافتراضية وتصفير المتجر لتبدأ بإدخال بياناتك الحقيقية من الصفر!', 'success');
  };

  // Sync API Client with active tenant and role
  useEffect(() => {
    api.setTenant(activeTenantId);
    api.setRole(currentStaffRole);
  }, [activeTenantId, currentStaffRole]);

  // Load from backend on start
  const refreshFromBackend = useCallback(async () => {
    try {
      setIsServerSyncing(true);
      const [tenantsRes, prodsRes, catsRes, ordsRes, cpnRes, stfRes] = await Promise.allSettled([
        api.getTenants(),
        api.getProducts(),
        api.getCategories(),
        api.getOrders(),
        api.getCoupons(),
        api.getStaff()
      ]);

      if (tenantsRes.status === 'fulfilled' && tenantsRes.value.tenants.length > 0) {
        const unique = new Map<string, TenantStore>();
        tenantsRes.value.tenants.forEach(t => {
          if (t && t.id) unique.set(t.id, t);
        });
        setTenants(Array.from(unique.values()));
      }
      if (prodsRes.status === 'fulfilled' && prodsRes.value.products.length > 0) {
        setProducts(prodsRes.value.products);
      }
      if (catsRes.status === 'fulfilled' && catsRes.value.categories.length > 0) {
        setCategories(catsRes.value.categories);
      }
      if (ordsRes.status === 'fulfilled') {
        setOrders(ordsRes.value.orders);
      }
      if (cpnRes.status === 'fulfilled') {
        setCoupons(cpnRes.value.coupons);
      }
      if (stfRes.status === 'fulfilled') {
        setStaff(stfRes.value.staff);
      }
    } catch (e) {
      console.warn('Backend sync deferred to local cache:', e);
    } finally {
      setIsServerSyncing(false);
    }
  }, []);

  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  // High-performance debounced storage persistence to prevent main-thread lag
  const debouncedStorageRef = React.useRef<Record<string, any>>({});
  const saveToStorageDebounced = useCallback((key: string, data: any, delay = 200) => {
    if (typeof window === 'undefined') return;
    if (debouncedStorageRef.current[key]) {
      clearTimeout(debouncedStorageRef.current[key]);
    }
    debouncedStorageRef.current[key] = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.warn(`[Storage] Failed to persist ${key}:`, e);
      }
    }, delay);
  }, []);

  // Sync to localStorage asynchronously
  useEffect(() => {
    saveToStorageDebounced('commerceos_tenants', tenants);
  }, [tenants, saveToStorageDebounced]);

  useEffect(() => {
    saveToStorageDebounced('commerceos_products', products);
  }, [products, saveToStorageDebounced]);

  useEffect(() => {
    saveToStorageDebounced('commerceos_orders', orders);
  }, [orders, saveToStorageDebounced]);

  useEffect(() => {
    saveToStorageDebounced('commerceos_coupons', coupons);
  }, [coupons, saveToStorageDebounced]);

  useEffect(() => {
    saveToStorageDebounced('commerceos_categories', categories);
  }, [categories, saveToStorageDebounced]);

  useEffect(() => {
    saveToStorageDebounced('commerceos_customers', customers);
  }, [customers, saveToStorageDebounced]);

  useEffect(() => {
    saveToStorageDebounced('commerceos_debts', debts);
  }, [debts, saveToStorageDebounced]);

  useEffect(() => {
    saveToStorageDebounced('commerceos_expenses', expenses);
  }, [expenses, saveToStorageDebounced]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Active Tenant
  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0] || {
    id: 'empty-store',
    name: 'متجر جديد',
    nameEn: 'New Store',
    slug: 'new-store',
    description: 'متجر جديد نظيف',
    descriptionEn: 'Clean new store',
    businessType: 'general',
    logo: '',
    logoIcon: 'Store',
    slogan: 'ابدأ متجرك الآن',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    domain: 'store.commerceos.app',
    plan: 'pro',
    status: 'active',
    createdAt: new Date().toISOString(),
    contact: { email: '', phone: '', city: 'الرياض', country: 'المملكة العربية السعودية' },
    theme: { style: 'modern', layout: 'modern', fontFamily: 'tajawal', radius: 'md', shadow: 'soft', headerStyle: 'solid', cardStyle: 'bordered', darkMode: false, tokens: generateDesignTokens('#3B82F6', 'modern', false) },
    sections: [],
    pwaConfig: { appName: 'متجر جديد', shortName: 'متجر', themeColor: '#3B82F6', backgroundColor: '#FFFFFF', enablePush: true },
    paymentGateways: { mada: true, applePay: true, visa: true, cod: true, tamara: true, bankTransfer: true }
  };

  // RBAC Permission Resolution
  const activeStaffPermissions = React.useMemo(() => {
    switch (currentStaffRole) {
      case 'store_owner':
      case 'store_admin':
        return { products: true, orders: true, customers: true, inventory: true, coupons: true, theme: true, staff: true, settings: true, reports: true };
      case 'product_manager':
        return { products: true, orders: false, customers: false, inventory: true, coupons: true, theme: false, staff: false, settings: false, reports: true };
      case 'order_manager':
        return { products: false, orders: true, customers: true, inventory: false, coupons: false, theme: false, staff: false, settings: false, reports: true };
      case 'inventory_manager':
        return { products: true, orders: false, customers: false, inventory: true, coupons: false, theme: false, staff: false, settings: false, reports: true };
      case 'marketing_manager':
        return { products: true, orders: false, customers: true, inventory: false, coupons: true, theme: true, staff: false, settings: false, reports: true };
      case 'support_agent':
        return { products: false, orders: true, customers: true, inventory: false, coupons: false, theme: false, staff: false, settings: false, reports: false };
      default:
        return { products: true, orders: true, customers: true, inventory: true, coupons: true, theme: true, staff: true, settings: true, reports: true };
    }
  }, [currentStaffRole]);

  // Cart operations
  const addToCart = (product: Product, variant?: ProductVariant, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.variant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }

      return [...prev, { product, variant, quantity }];
    });

    showToast(`تمت إضافة "${product.name}" إلى السلة`, 'success');
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart(prev => prev.filter(
      item => !(item.product.id === productId && item.variant?.id === variantId)
    ));
    showToast('تم حذف المنتج من السلة', 'info');
  };

  const updateCartQuantity = (productId: string, variantId: string | undefined, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.variant?.id === variantId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  // Tenant Operations
  const createTenant = async (newTenant: any, newProducts?: Product[], newCategories?: Category[]) => {
    const tenantId = newTenant.id || `tenant-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const defaultColor = '#C9A45C'; // Our premium gold
    const completeTenant: TenantStore = {
      id: tenantId,
      name: newTenant.name || 'متجر جديد',
      nameEn: newTenant.nameEn || 'New Store',
      slug: newTenant.slug || 'new-store',
      description: newTenant.description || 'متجر جديد نظيف',
      descriptionEn: newTenant.descriptionEn || 'Clean new store',
      businessType: newTenant.businessType || 'general',
      logo: newTenant.logo || '',
      logoIcon: newTenant.logoIcon || 'Store',
      slogan: newTenant.slogan || 'ابدأ متجرك الآن',
      currency: newTenant.currency || 'SAR',
      currencySymbol: newTenant.currencySymbol || 'ر.س',
      domain: newTenant.domain || `${newTenant.slug || 'store'}.commerceos.app`,
      plan: newTenant.plan || 'pro',
      status: newTenant.status || 'active',
      createdAt: newTenant.createdAt || new Date().toISOString(),
      contact: {
        email: newTenant.contact?.email || currentUser?.email || '',
        phone: newTenant.contact?.phone || '',
        city: newTenant.contact?.city || 'الرياض',
        country: newTenant.contact?.country || 'المملكة العربية السعودية',
        ...newTenant.contact
      },
      social: {
        instagram: '',
        twitter: '',
        tiktok: '',
        ...newTenant.social
      },
      theme: newTenant.theme || {
        style: 'modern',
        layout: 'modern',
        fontFamily: 'tajawal',
        radius: 'md',
        shadow: 'soft',
        headerStyle: 'solid',
        cardStyle: 'bordered',
        darkMode: false,
        tokens: generateDesignTokens(defaultColor, 'modern', false)
      },
      sections: newTenant.sections || [
        { id: `sec-${Date.now()}-1`, type: 'hero', title: `أهلاً بكم في ${newTenant.name || 'متجرنا'}`, titleEn: `Welcome to ${newTenant.nameEn || 'Our Store'}`, subtitle: 'أفضل المنتجات بأعلى معايير الجودة والضمان', enabled: true, order: 1 },
        { id: `sec-${Date.now()}-2`, type: 'featured_products', title: 'أحدث المنتجات المميزة', titleEn: 'Featured Products', enabled: true, order: 2 }
      ],
      pwaConfig: {
        appName: newTenant.name || 'متجر جديد',
        shortName: (newTenant.name || 'متجر').substring(0, 12),
        themeColor: defaultColor,
        backgroundColor: '#FFFFFF',
        enablePush: true,
        ...newTenant.pwaConfig
      },
      paymentGateways: {
        mada: true,
        applePay: true,
        visa: true,
        cod: true,
        tamara: true,
        bankTransfer: true,
        ...newTenant.paymentGateways
      },
      shippingMethods: newTenant.shippingMethods || [
        { id: `ship-${Date.now()}-1`, name: 'توصيل قياسي سريع', nameEn: 'Standard Fast Delivery', cost: 25, estimatedDays: '2-3 أيام عمل', active: true },
        { id: `ship-${Date.now()}-2`, name: 'شحن مجاني للطلبات فوق 200 ر.س', nameEn: 'Free Shipping (Over 200 SAR)', cost: 0, estimatedDays: '3-4 أيام عمل', active: true }
      ]
    };

    setTenants(prev => {
      const filtered = prev.filter(t => t.id !== completeTenant.id);
      return [completeTenant, ...filtered];
    });
    if (newProducts && newProducts.length > 0) {
      const productsWithTenant = newProducts.map(p => ({ ...p, tenantId }));
      setProducts(prev => [...productsWithTenant, ...prev]);
    }
    if (newCategories && newCategories.length > 0) {
      const categoriesWithTenant = newCategories.map(c => ({ ...c, tenantId }));
      setCategories(prev => [...categoriesWithTenant, ...prev]);
    }
    setActiveTenantId(tenantId);
    showToast(`تم تدشين متجر "${completeTenant.name}" بنجاح!`, 'success');

    // Sync with backend
    try {
      await api.createTenant(completeTenant);
      if (newProducts) {
        for (const p of newProducts) {
          await api.createProduct({ ...p, tenantId });
        }
      }
      if (newCategories) {
        for (const c of newCategories) {
          await api.createCategory({ ...c, tenantId });
        }
      }
    } catch (err) {
      console.warn('Backend sync for createTenant:', err);
    }

    return completeTenant;
  };

  const cloneTenant = async (sourceTenantId: string): Promise<TenantStore> => {
    const source = tenants.find(t => t.id === sourceTenantId) || activeTenant;
    const newId = `tenant-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newSlug = `${source.slug}-copy-${Math.floor(Math.random() * 1000)}`;
    const clonedTenant: TenantStore = {
      ...source,
      id: newId,
      name: `${source.name} (نسخة)`,
      nameEn: `${source.nameEn || source.name} (Copy)`,
      slug: newSlug,
      domain: `${newSlug}.commerceos.app`,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Duplicate products for this tenant
    const sourceProducts = products.filter(p => p.tenantId === source.id);
    const clonedProducts: Product[] = sourceProducts.map(p => ({
      ...p,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      tenantId: newId
    }));

    // Duplicate categories for this tenant
    const sourceCategories = categories.filter(c => c.tenantId === source.id);
    const clonedCategories: Category[] = sourceCategories.map(c => ({
      ...c,
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      tenantId: newId
    }));

    setTenants(prev => [clonedTenant, ...prev]);
    if (clonedProducts.length > 0) {
      setProducts(prev => [...clonedProducts, ...prev]);
    }
    if (clonedCategories.length > 0) {
      setCategories(prev => [...clonedCategories, ...prev]);
    }

    setActiveTenantId(newId);
    showToast(`تم استنساخ المشروع "${clonedTenant.name}" بنجاح!`, 'success');

    try {
      await api.createTenant(clonedTenant);
      for (const p of clonedProducts) {
        await api.createProduct(p);
      }
      for (const c of clonedCategories) {
        await api.createCategory(c);
      }
    } catch (err) {
      console.warn('Backend sync for cloneTenant:', err);
    }

    return clonedTenant;
  };

  const updateTenant = async (tenantId: string, updates: Partial<TenantStore>) => {
    setTenants(prev => prev.map(t => (t.id === tenantId ? { ...t, ...updates } : t)));
    showToast('تم حفظ إعدادات المتجر بنجاح', 'success');

    try {
      await api.updateTenant(tenantId, updates);
    } catch (err) {
      console.warn('Backend sync for updateTenant:', err);
    }
  };

  const deleteTenant = async (tenantId: string) => {
    setTenants(prev => prev.filter(t => t.id !== tenantId));
    if (activeTenantId === tenantId) {
      const remaining = tenants.filter(t => t.id !== tenantId);
      if (remaining.length > 0) setActiveTenantId(remaining[0].id);
    }
    showToast('تم حذف المتجر', 'info');

    try {
      await api.deleteTenant(tenantId);
    } catch (err) {
      console.warn('Backend sync for deleteTenant:', err);
    }
  };

  const updateTheme = async (tenantId: string, theme: StoreTheme) => {
    setTenants(prev => prev.map(t => (t.id === tenantId ? { ...t, theme } : t)));
    showToast('تم تحديث هوية وتصميم المتجر مباشرة', 'success');

    try {
      await api.updateTenantTheme(tenantId, theme);
    } catch (err) {
      console.warn('Backend sync for updateTheme:', err);
    }
  };

  // Product Operations
  const addProduct = async (prodData: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = { ...prodData, id };
    setProducts(prev => [newProduct, ...prev]);
    showToast(`تمت إضافة منتج "${prodData.name}" بنجاح`, 'success');

    try {
      await api.createProduct(newProduct);
    } catch (err) {
      console.warn('Backend sync for addProduct:', err);
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === productId ? { ...p, ...updates } : p)));
    showToast('تم تحديث بيانات المنتج', 'success');

    try {
      await api.updateProduct(productId, updates);
    } catch (err) {
      console.warn('Backend sync for updateProduct:', err);
    }
  };

  const deleteProduct = async (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('تم حذف المنتج', 'info');

    try {
      await api.deleteProduct(productId);
    } catch (err) {
      console.warn('Backend sync for deleteProduct:', err);
    }
  };

  // Category Operations
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const id = `cat-${Date.now()}`;
    const newCategory: Category = { ...catData, id };
    setCategories(prev => [newCategory, ...prev]);
    showToast(`تمت إضافة التصنيف "${catData.name}" بنجاح`, 'success');
  };

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => (c.id === categoryId ? { ...c, ...updates } : c)));
    showToast('تم تحديث بيانات التصنيف', 'success');
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    showToast('تم حذف التصنيف', 'info');
  };

  // Orders Operations with Atomic Server Reservation
  const addOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>): Promise<Order> => {
    const id = `ord-${Date.now()}`;
    const num = Math.floor(1000 + Math.random() * 9000);
    const slugPrefix = (activeTenant?.slug || 'ST').substring(0, 2).toUpperCase();
    const orderNumber = `#${slugPrefix}-${num}`;
    const now = new Date().toISOString();

    const fallbackOrder: Order = {
      ...orderData,
      tax: orderData.tax || 0,
      id,
      orderNumber,
      createdAt: now,
      timeline: [
        { status: 'new', timestamp: now, note: `تم تأكيد الطلب بنجاح عبر ${orderData.paymentMethod}` }
      ]
    };

    try {
      const res = await api.createOrder({
        customer: orderData.customer,
        items: orderData.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        paymentMethod: orderData.paymentMethod,
        bankTransferDetails: orderData.bankTransferDetails,
        couponCode: undefined
      });
      if (res.success && res.order) {
        setOrders(prev => [res.order, ...prev]);
        // Also adjust local product stock to match atomic server inventory
        setProducts(prev => prev.map(p => {
          const item = orderData.items.find(i => i.productId === p.id);
          if (item) {
            const newStock = Math.max(0, p.stock - item.quantity);
            return { ...p, stock: newStock, inStock: newStock > 0 };
          }
          return p;
        }));
        clearCart();
        return res.order;
      }
    } catch (err) {
      console.warn('Backend order call failed, proceeding with optimistic order:', err);
    }

    setOrders(prev => [fallbackOrder, ...prev]);
    clearCart();
    return fallbackOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], note?: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const now = new Date().toISOString();
        const statusNote = note || `تم تحديث حالة الطلب إلى: ${status}`;
        return {
          ...ord,
          status,
          timeline: [...ord.timeline, { status, timestamp: now, note: statusNote }]
        };
      }
      return ord;
    }));
    showToast(`تم تحديث حالة الطلب إلى ${status}`, 'success');

    try {
      await api.updateOrderStatus(orderId, status, note);
    } catch (err) {
      console.warn('Backend sync for updateOrderStatus:', err);
    }
  };

  const updateOrderPaymentStatus = async (orderId: string, paymentStatus: Order['paymentStatus'], note?: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const now = new Date().toISOString();
        const paymentNote = note || `تم تحديث حالة الدفع إلى: ${paymentStatus}`;
        const newOrderStatus = (paymentStatus === 'paid' && ord.status === 'new') ? 'processing' : ord.status;
        return {
          ...ord,
          paymentStatus,
          status: newOrderStatus,
          timeline: [...ord.timeline, { status: newOrderStatus, timestamp: now, note: paymentNote }]
        };
      }
      return ord;
    }));
    showToast(`تم تحديث حالة الدفع إلى ${paymentStatus === 'paid' ? 'مدفوع ومؤكد' : paymentStatus}`, 'success');

    try {
      await api.updateOrderPaymentStatus(orderId, paymentStatus, note);
    } catch (err) {
      console.warn('Backend sync for updateOrderPaymentStatus:', err);
    }
  };

  const addCustomer = (custData: Omit<Customer, 'id'>) => {
    const id = `cust-${Date.now()}`;
    setCustomers(prev => [{ ...custData, id }, ...prev]);
    showToast('تمت إضافة العميل', 'success');
  };

  const addCoupon = async (couponData: Omit<Coupon, 'id'>) => {
    const id = `coup-${Date.now()}`;
    const newCoupon: Coupon = { ...couponData, id };
    setCoupons(prev => [newCoupon, ...prev]);
    showToast(`تم إنشاء الكوبون "${couponData.code}" بنجاح`, 'success');

    try {
      await api.createCoupon(newCoupon);
    } catch (err) {
      console.warn('Backend sync for addCoupon:', err);
    }
  };

  const updateCoupon = (couponId: string, updates: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => (c.id === couponId ? { ...c, ...updates } : c)));
    showToast('تم تحديث بيانات الكوبون بنجاح', 'success');
  };

  const deleteCoupon = async (couponId: string) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
    showToast('تم حذف الكوبون', 'info');

    try {
      await api.deleteCoupon(couponId);
    } catch (err) {
      console.warn('Backend sync for deleteCoupon:', err);
    }
  };

  // Debt (آجل / ديون) Operations
  const addDebt = (debtData: Omit<DebtRecord, 'id' | 'createdAt' | 'transactions' | 'status' | 'remainingAmount'>) => {
    const id = `debt-${Date.now()}`;
    const now = new Date().toISOString();
    const paidAmount = debtData.paidAmount || 0;
    const remainingAmount = Math.max(0, debtData.totalAmount - paidAmount);
    const newDebt: DebtRecord = {
      ...debtData,
      id,
      paidAmount,
      remainingAmount,
      status: paidAmount >= debtData.totalAmount ? 'settled' : paidAmount > 0 ? 'partially_paid' : 'pending',
      createdAt: now,
      transactions: paidAmount > 0 ? [
        {
          id: `tx-${Date.now()}`,
          date: now.split('T')[0],
          amount: paidAmount,
          paymentMethod: 'cash',
          note: 'دفعة أولى عند تسجيل الدين'
        }
      ] : []
    };
    setDebts(prev => [newDebt, ...prev]);
    showToast(`تم تسجيل حساب آجل جديد للطرف "${debtData.personName}"`, 'success');
  };

  const recordDebtPayment = (debtId: string, amount: number, paymentMethod: DebtTransaction['paymentMethod'], note?: string) => {
    const now = new Date().toISOString();
    setDebts(prev => prev.map(d => {
      if (d.id === debtId) {
        const newPaid = d.paidAmount + amount;
        const remainingAmount = Math.max(0, d.totalAmount - newPaid);
        const newStatus = newPaid >= d.totalAmount ? 'settled' : 'partially_paid';
        const newTx: DebtTransaction = {
          id: `tx-${Date.now()}`,
          date: now.split('T')[0],
          amount,
          paymentMethod,
          note: note || 'دفعة سداد دين'
        };
        return {
          ...d,
          paidAmount: newPaid,
          remainingAmount,
          status: newStatus,
          transactions: [...d.transactions, newTx]
        };
      }
      return d;
    }));
    showToast(`تم تسجيل سداد بقيمة ${amount} ر.س بنجاح`, 'success');
  };

  const deleteDebt = (debtId: string) => {
    setDebts(prev => prev.filter(d => d.id !== debtId));
    showToast('تم حذف سجل الدين بنجاح', 'info');
  };

  // Expense (مصروفات) Operations
  const addExpense = (expData: Omit<ExpenseRecord, 'id'>) => {
    const id = `exp-${Date.now()}`;
    const newExpense: ExpenseRecord = {
      ...expData,
      id
    };
    setExpenses(prev => [newExpense, ...prev]);
    showToast(`تم تسجيل المصروف "${expData.title}" بقيمة ${expData.amount} ر.س`, 'success');
  };

  const deleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
    showToast('تم حذف سجل المصروف', 'info');
  };

  const addStaff = async (staffData: Omit<StaffMember, 'id' | 'createdAt'>) => {
    const id = `staff-${Date.now()}`;
    const newMember: StaffMember = {
      ...staffData,
      id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStaff(prev => [newMember, ...prev]);
    showToast(`تم إرسال دعوة الانضمام إلى ${staffData.email}`, 'success');

    try {
      await api.createStaff(newMember);
    } catch (err) {
      console.warn('Backend sync for addStaff:', err);
    }
  };

  const updateStaff = async (staffId: string, updates: Partial<StaffMember>) => {
    setStaff(prev => prev.map(s => (s.id === staffId ? { ...s, ...updates } : s)));
    showToast('تم تحديث صلاحيات الموظف', 'success');

    try {
      await api.updateStaff(staffId, updates);
    } catch (err) {
      console.warn('Backend sync for updateStaff:', err);
    }
  };

  const deleteStaff = async (staffId: string) => {
    setStaff(prev => prev.filter(s => s.id !== staffId));
    showToast('تم حذف حساب الموظف', 'info');

    try {
      await api.deleteStaff(staffId);
    } catch (err) {
      console.warn('Backend sync for deleteStaff:', err);
    }
  };

  // Licensing and Super Admin Controls
  const updatePlatformConfig = (updates: Partial<PlatformLicensingConfig>) => {
    setPlatformConfig(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('commerceos_platform_config', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('تم حفظ إعدادات وتسعير التراخيص بنجاح', 'success');
  };

  const applyLicenseToTenant = (tenantId: string, licenseKey: string): boolean => {
    const result = validateLicenseKey(licenseKey, tenantId);
    if (!result.valid) {
      showToast(result.error || 'مفتاح الترخيص غير صالح', 'error');
      return false;
    }

    setTenants(prev => prev.map(t => {
      if (t.id === tenantId) {
        const nextLicensing = {
          tier: result.tier,
          licenseKey,
          isWhiteLabel: true,
          issuedAt: new Date().toISOString(),
          verified: true,
          customBranding: {
            removeCommerceOSFooter: true,
            customFooterText: `جميع الحقوق محفوظة لمتجر ${t.name} 2026`,
            customPoweredBy: result.tier === 'agency_sovereign' ? 'Sovereign Core' : 'White-Label Engine',
            hideWatermarkInExports: true
          },
          tamperAttemptsCount: 0
        };
        return {
          ...t,
          licensing: nextLicensing
        };
      }
      return t;
    }));

    showToast('تم تفعيل ترخيص White-Label بنجاح! تم إلغاء الشارة وتمكين التصدير النظيف 100%', 'success');
    return true;
  };

  const toggleWhiteLabel = (tenantId: string, enabled: boolean) => {
    setTenants(prev => prev.map(t => {
      if (t.id === tenantId) {
        const key = enabled ? (t.licensing?.licenseKey || generateLicenseKey(tenantId, 'white_label_single').key) : undefined;
        return {
          ...t,
          licensing: {
            tier: enabled ? 'white_label_single' : 'free',
            licenseKey: key,
            isWhiteLabel: enabled,
            verified: enabled,
            issuedAt: enabled ? new Date().toISOString() : undefined,
            customBranding: {
              removeCommerceOSFooter: enabled,
              customFooterText: enabled ? `جميع الحقوق محفوظة لمتجر ${t.name}` : undefined,
              hideWatermarkInExports: enabled
            }
          }
        };
      }
      return t;
    }));
    showToast(enabled ? 'تم تفعيل الـ White-Label للمتجر' : 'تم تفعيل وضع الشارة المجانية', 'info');
  };

  const updateTenantStatus = (tenantId: string, status: 'active' | 'suspended' | 'trial') => {
    setTenants(prev => prev.map(t => (t.id === tenantId ? { ...t, status } : t)));
    const msg = status === 'suspended' ? 'تم تجميد حساب المتجر بنجاح' : status === 'active' ? 'تم تنشيط حساب المتجر بنجاح' : 'تم تحويل المتجر إلى الفترة التجريبية';
    showToast(msg, status === 'suspended' ? 'warning' : 'success');
  };

  const updateTenantQuotas = (tenantId: string, quotas: Partial<TenantQuotas>) => {
    setTenants(prev => prev.map(t => {
      if (t.id === tenantId) {
        const defaultQuotas: TenantQuotas = {
          maxProducts: 500,
          maxStaff: 5,
          maxMonthlyBuilds: 30,
          usedMonthlyBuilds: t.quotas?.usedMonthlyBuilds || 0,
          allowCustomDomain: true,
          allowDockerSelfHost: true,
          allowNativeIosAndroid: true,
          storageQuotaMb: 1000,
          usedStorageMb: t.quotas?.usedStorageMb || 50
        };
        return {
          ...t,
          quotas: {
            ...(t.quotas || defaultQuotas),
            ...quotas
          }
        };
      }
      return t;
    }));
    showToast('تم تحديث حدود وحصص المتجر (Quotas) بنجاح', 'success');
  };

  const logTamperEvent = (event: Omit<TamperEventLog, 'id' | 'detectedAt'>) => {
    const newLog: TamperEventLog = {
      ...event,
      id: `tamper-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      detectedAt: new Date().toISOString()
    };
    setPlatformConfig(prev => {
      const next = {
        ...prev,
        tamperLog: [newLog, ...(prev.tamperLog || [])].slice(0, 100)
      };
      try {
        localStorage.setItem('commerceos_platform_config', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Filtered lists for active tenant memoized for optimal re-render performance
  const tenantProducts = useMemo(() => products.filter(p => p.tenantId === activeTenantId), [products, activeTenantId]);
  const tenantCategories = useMemo(() => categories.filter(c => c.tenantId === activeTenantId), [categories, activeTenantId]);
  const tenantOrders = useMemo(() => orders.filter(o => o.tenantId === activeTenantId), [orders, activeTenantId]);
  const tenantCustomers = useMemo(() => customers.filter(c => c.tenantId === activeTenantId), [customers, activeTenantId]);
  const tenantCoupons = useMemo(() => coupons.filter(c => c.tenantId === activeTenantId), [coupons, activeTenantId]);
  const tenantStaff = useMemo(() => staff.filter(s => s.tenantId === activeTenantId), [staff, activeTenantId]);
  const tenantDebts = useMemo(() => debts.filter(d => d.tenantId === activeTenantId), [debts, activeTenantId]);
  const tenantExpenses = useMemo(() => expenses.filter(e => e.tenantId === activeTenantId), [expenses, activeTenantId]);

  const contextValue = useMemo(() => ({
    currentView,
    setCurrentView: handleSetCurrentView,
    previewDevice,
    setPreviewDevice,
    language,
    setLanguage,
    activeTenantId,
    setActiveTenantId,
    activeTenant,
    tenants,
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    openAuthModal,
    resetToCleanStore,
    currentStaffRole,
    setCurrentStaffRole,
    activeStaffPermissions,
    products: tenantProducts,
    categories: tenantCategories,
    orders: tenantOrders,
    customers: tenantCustomers,
    coupons: tenantCoupons,
    staff: tenantStaff,
    debts: tenantDebts,
    expenses: tenantExpenses,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartOpen,
    setCartOpen,
    checkoutOpen,
    setCheckoutOpen,
    productModal,
    setProductModal,
    isServerSyncing,
    refreshFromBackend,
    createTenant,
    cloneTenant,
    updateTenant,
    deleteTenant,
    updateTheme,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    addCustomer,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    addDebt,
    recordDebtPayment,
    deleteDebt,
    addExpense,
    deleteExpense,
    addStaff,
    updateStaff,
    deleteStaff,
    toasts,
    showToast,
    dismissToast,
    platformConfig,
    updatePlatformConfig,
    applyLicenseToTenant,
    toggleWhiteLabel,
    updateTenantStatus,
    updateTenantQuotas,
    logTamperEvent,
    tamperAlertModalOpen,
    setTamperAlertModalOpen,
    tamperModalData,
    setTamperModalData
  }), [
    currentView,
    handleSetCurrentView,
    previewDevice,
    setPreviewDevice,
    language,
    setLanguage,
    activeTenantId,
    setActiveTenantId,
    activeTenant,
    tenants,
    currentUser,
    login,
    register,
    logout,
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    openAuthModal,
    resetToCleanStore,
    currentStaffRole,
    setCurrentStaffRole,
    activeStaffPermissions,
    tenantProducts,
    tenantCategories,
    tenantOrders,
    tenantCustomers,
    tenantCoupons,
    tenantStaff,
    tenantDebts,
    tenantExpenses,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartOpen,
    setCartOpen,
    checkoutOpen,
    setCheckoutOpen,
    productModal,
    setProductModal,
    isServerSyncing,
    refreshFromBackend,
    createTenant,
    cloneTenant,
    updateTenant,
    deleteTenant,
    updateTheme,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    addCustomer,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    addDebt,
    recordDebtPayment,
    deleteDebt,
    addExpense,
    deleteExpense,
    addStaff,
    updateStaff,
    deleteStaff,
    toasts,
    showToast,
    dismissToast,
    platformConfig,
    updatePlatformConfig,
    applyLicenseToTenant,
    toggleWhiteLabel,
    updateTenantStatus,
    updateTenantQuotas,
    logTamperEvent,
    tamperAlertModalOpen,
    setTamperAlertModalOpen,
    tamperModalData,
    setTamperModalData
  ]);

  return (
    <CommerceContext.Provider value={contextValue}>
      {children}
    </CommerceContext.Provider>
  );
};

export const useCommerce = () => {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error('useCommerce must be used within a CommerceProvider');
  }
  return context;
};

