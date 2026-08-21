import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
  TenantStore
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_STAFF,
  INITIAL_TENANTS
} from '../data/initialData';
import { api } from '../api/client';

export type AppView = 'storefront' | 'merchant_dashboard' | 'builder_wizard' | 'platform_admin' | 'live_customizer';
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
  createTenant: (newTenant: TenantStore, initialProducts?: Product[], initialCategories?: Category[]) => void;
  updateTenant: (tenantId: string, updates: Partial<TenantStore>) => void;
  deleteTenant: (tenantId: string) => void;
  updateTheme: (tenantId: string, theme: StoreTheme) => void;

  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  addOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status'], note?: string) => void;

  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  deleteCoupon: (couponId: string) => void;

  addStaff: (staff: Omit<StaffMember, 'id' | 'createdAt'>) => void;
  updateStaff: (staffId: string, updates: Partial<StaffMember>) => void;
  deleteStaff: (staffId: string) => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
}

const CommerceContext = createContext<CommerceContextType | null>(null);

export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // View states
  const [currentView, setCurrentView] = useState<AppView>('storefront');
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [activeTenantId, setActiveTenantId] = useState<string>('tenant-royal-honey');
  const [currentStaffRole, setCurrentStaffRole] = useState<StaffRole>('store_owner');
  const [isServerSyncing, setIsServerSyncing] = useState<boolean>(false);

  // Initialize with initial data & local storage fallback
  const [tenants, setTenants] = useState<TenantStore[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_tenants');
      return saved ? JSON.parse(saved) : INITIAL_TENANTS;
    } catch {
      return INITIAL_TENANTS;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_staff');
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  // Cart & UI modals
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [productModal, setProductModal] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

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
        setTenants(tenantsRes.value.tenants);
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

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('commerceos_tenants', JSON.stringify(tenants));
    } catch (e) { console.error(e); }
  }, [tenants]);

  useEffect(() => {
    try {
      localStorage.setItem('commerceos_products', JSON.stringify(products));
    } catch (e) { console.error(e); }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('commerceos_orders', JSON.stringify(orders));
    } catch (e) { console.error(e); }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('commerceos_coupons', JSON.stringify(coupons));
    } catch (e) { console.error(e); }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('commerceos_staff', JSON.stringify(staff));
    } catch (e) { console.error(e); }
  }, [staff]);

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
  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0] || INITIAL_TENANTS[0];

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
  const createTenant = async (newTenant: TenantStore, newProducts?: Product[], newCategories?: Category[]) => {
    setTenants(prev => [newTenant, ...prev]);
    if (newProducts && newProducts.length > 0) {
      setProducts(prev => [...newProducts, ...prev]);
    }
    if (newCategories && newCategories.length > 0) {
      setCategories(prev => [...newCategories, ...prev]);
    }
    setActiveTenantId(newTenant.id);
    showToast(`تم تدشين متجر "${newTenant.name}" بنجاح!`, 'success');

    // Sync with backend
    try {
      await api.createTenant(newTenant);
      if (newProducts) {
        for (const p of newProducts) {
          await api.createProduct(p);
        }
      }
      if (newCategories) {
        for (const c of newCategories) {
          await api.createCategory(c);
        }
      }
    } catch (err) {
      console.warn('Backend sync for createTenant:', err);
    }
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

  // Orders Operations with Atomic Server Reservation
  const addOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>): Promise<Order> => {
    const id = `ord-${Date.now()}`;
    const num = Math.floor(1000 + Math.random() * 9000);
    const slugPrefix = (activeTenant?.slug || 'ST').substring(0, 2).toUpperCase();
    const orderNumber = `#${slugPrefix}-${num}`;
    const now = new Date().toISOString();

    const fallbackOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt: now,
      timeline: [
        { status: 'new', timestamp: now, note: `تم تأكيد الطلب بنجاح عبر ${orderData.paymentMethod}` }
      ]
    };

    try {
      const res = await api.createOrder(orderData);
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

  const deleteCoupon = (couponId: string) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
    showToast('تم حذف الكوبون', 'info');
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

  // Filtered lists for active tenant
  const tenantProducts = products.filter(p => p.tenantId === activeTenantId);
  const tenantCategories = categories.filter(c => c.tenantId === activeTenantId);
  const tenantOrders = orders.filter(o => o.tenantId === activeTenantId);
  const tenantCustomers = customers.filter(c => c.tenantId === activeTenantId);
  const tenantCoupons = coupons.filter(c => c.tenantId === activeTenantId);
  const tenantStaff = staff.filter(s => s.tenantId === activeTenantId);

  return (
    <CommerceContext.Provider
      value={{
        currentView,
        setCurrentView,
        previewDevice,
        setPreviewDevice,
        language,
        setLanguage,
        activeTenantId,
        setActiveTenantId,
        activeTenant,
        tenants,
        currentStaffRole,
        setCurrentStaffRole,
        activeStaffPermissions,
        products: tenantProducts,
        categories: tenantCategories,
        orders: tenantOrders,
        customers: tenantCustomers,
        coupons: tenantCoupons,
        staff: tenantStaff,
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
        updateTenant,
        deleteTenant,
        updateTheme,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        addCustomer,
        addCoupon,
        deleteCoupon,
        addStaff,
        updateStaff,
        deleteStaff,
        toasts,
        showToast,
        dismissToast
      }}
    >
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

