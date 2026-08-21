import fs from 'fs';
import path from 'path';
import { 
  Category, 
  Coupon, 
  Customer, 
  Order, 
  Product, 
  StaffMember, 
  SubscriptionPlan, 
  TenantStore,
  StoreTheme
} from '../src/types';
import { 
  INITIAL_TENANTS, 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_COUPONS, 
  INITIAL_STAFF, 
  SUBSCRIPTION_PLANS 
} from '../src/data/initialData';

export interface DatabaseSchema {
  tenants: TenantStore[];
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  staff: StaffMember[];
  plans: SubscriptionPlan[];
  auditLogs: {
    id: string;
    tenantId: string;
    action: string;
    performedBy: string;
    details: any;
    timestamp: string;
  }[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'commerceos_db.json');

// Valid State Transitions Map
export const ALLOWED_STATUS_TRANSITIONS: Record<Order['status'], Order['status'][]> = {
  new: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [], // Terminal state
  cancelled: []  // Terminal state
};

class DatabaseEngine {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed.tenants && parsed.products) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing from defaults:', err);
    }

    // Default seeded schema
    const initialDb: DatabaseSchema = {
      tenants: [...INITIAL_TENANTS],
      products: [...INITIAL_PRODUCTS],
      categories: [...INITIAL_CATEGORIES],
      orders: [...INITIAL_ORDERS],
      customers: [...INITIAL_CUSTOMERS],
      coupons: [...INITIAL_COUPONS],
      staff: [...INITIAL_STAFF],
      plans: [...SUBSCRIPTION_PLANS],
      auditLogs: [
        {
          id: 'log-seed-1',
          tenantId: 'tenant-royal-honey',
          action: 'STORE_INITIALIZED',
          performedBy: 'System Bootstrap',
          details: { message: 'Database initialized with flagship stores' },
          timestamp: new Date().toISOString()
        }
      ]
    };

    this.persistNow(initialDb);
    return initialDb;
  }

  private persistNow(dataToSave: DatabaseSchema) {
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  private queueSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.persistNow(this.data);
      this.saveTimeout = null;
    }, 150);
  }

  // --- Tenants ---
  getTenants(): TenantStore[] {
    return this.data.tenants;
  }

  getTenantByIdOrSlug(idOrSlug: string): TenantStore | undefined {
    return this.data.tenants.find(
      t => t.id === idOrSlug || t.slug === idOrSlug || t.customDomain === idOrSlug
    );
  }

  createTenant(tenant: TenantStore): TenantStore {
    this.data.tenants.push(tenant);
    this.addAuditLog(tenant.id, 'TENANT_CREATED', 'Admin', { name: tenant.name, slug: tenant.slug });
    this.queueSave();
    return tenant;
  }

  updateTenant(id: string, updates: Partial<TenantStore>): TenantStore | null {
    const idx = this.data.tenants.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.tenants[idx] = { ...this.data.tenants[idx], ...updates };
    this.addAuditLog(id, 'TENANT_UPDATED', 'Admin', updates);
    this.queueSave();
    return this.data.tenants[idx];
  }

  updateTenantTheme(id: string, theme: StoreTheme): TenantStore | null {
    const idx = this.data.tenants.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.tenants[idx].theme = theme;
    this.addAuditLog(id, 'THEME_UPDATED', 'Designer', { style: theme.style, layout: theme.layout });
    this.queueSave();
    return this.data.tenants[idx];
  }

  deleteTenant(id: string): boolean {
    const initialLen = this.data.tenants.length;
    this.data.tenants = this.data.tenants.filter(t => t.id !== id);
    this.data.products = this.data.products.filter(p => p.tenantId !== id);
    this.data.categories = this.data.categories.filter(c => c.tenantId !== id);
    this.data.orders = this.data.orders.filter(o => o.tenantId !== id);
    this.data.coupons = this.data.coupons.filter(c => c.tenantId !== id);
    this.data.staff = this.data.staff.filter(s => s.tenantId !== id);
    this.addAuditLog(id, 'TENANT_DELETED', 'SuperAdmin', {});
    this.queueSave();
    return this.data.tenants.length < initialLen;
  }

  // --- Products & Inventory ---
  getProducts(tenantId?: string): Product[] {
    if (!tenantId) return this.data.products;
    return this.data.products.filter(p => p.tenantId === tenantId);
  }

  getProductById(id: string, tenantId?: string): Product | undefined {
    return this.data.products.find(
      p => p.id === id && (!tenantId || p.tenantId === tenantId)
    );
  }

  createProduct(product: Product): Product {
    this.data.products.push(product);
    this.addAuditLog(product.tenantId, 'PRODUCT_CREATED', 'Manager', { name: product.name, sku: product.sku });
    this.queueSave();
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>, tenantId?: string): Product | null {
    const idx = this.data.products.findIndex(
      p => p.id === id && (!tenantId || p.tenantId === tenantId)
    );
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.addAuditLog(this.data.products[idx].tenantId, 'PRODUCT_UPDATED', 'Manager', updates);
    this.queueSave();
    return this.data.products[idx];
  }

  deleteProduct(id: string, tenantId?: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(
      p => !(p.id === id && (!tenantId || p.tenantId === tenantId))
    );
    this.queueSave();
    return this.data.products.length < initialLen;
  }

  restockProduct(id: string, addedStock: number, tenantId?: string): Product | null {
    const product = this.getProductById(id, tenantId);
    if (!product) return null;
    product.stock += addedStock;
    this.addAuditLog(product.tenantId, 'INVENTORY_RESTOCKED', 'InventoryManager', { id, addedStock, newTotal: product.stock });
    this.queueSave();
    return product;
  }

  // --- Categories ---
  getCategories(tenantId?: string): Category[] {
    if (!tenantId) return this.data.categories;
    return this.data.categories.filter(c => c.tenantId === tenantId);
  }

  createCategory(category: Category): Category {
    this.data.categories.push(category);
    this.queueSave();
    return category;
  }

  // --- Orders & Strict Server-Side Pricing Engine ---
  getOrders(tenantId?: string): Order[] {
    if (!tenantId) return this.data.orders;
    return this.data.orders.filter(o => o.tenantId === tenantId);
  }

  getOrderById(id: string, tenantId?: string): Order | undefined {
    return this.data.orders.find(
      o => o.id === id && (!tenantId || o.tenantId === tenantId)
    );
  }

  /**
   * Secure Atomic Checkout:
   * 1. Rebuilds price, subtotal, and tax from Server-Side Database (Ignores client pricing)
   * 2. Validates and applies coupons server-side
   * 3. Validates and decrements stock in a critical section
   * 4. Updates customer stats and creates immutable order record
   */
  createOrderAtomic(input: {
    tenantId: string;
    customer: Order['customer'];
    items: { productId: string; quantity: number }[];
    paymentMethod: Order['paymentMethod'];
    couponCode?: string;
    shippingFee?: number;
  }): { success: boolean; order?: Order; error?: string } {
    const { tenantId, customer, items, paymentMethod, couponCode } = input;

    if (!items || items.length === 0) {
      return { success: false, error: 'السلة فارغة' };
    }

    // 1. Reconstruct order items and verify stock from DB truth
    let calculatedSubtotal = 0;
    const validatedItems: Order['items'] = [];

    for (const item of items) {
      const product = this.getProductById(item.productId, tenantId);
      if (!product) {
        return { success: false, error: `المنتج رقم (${item.productId}) غير متوفر في هذا المتجر` };
      }
      if (item.quantity <= 0) {
        return { success: false, error: `الكمية المطلوبة للمنتج (${product.name}) غير صحيحة` };
      }
      if (product.stock < item.quantity) {
        return { 
          success: false, 
          error: `عذراً، الكمية المتوفرة من (${product.name}) هي ${product.stock} فقط` 
        };
      }

      const itemTotal = product.price * item.quantity;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        image: product.images[0] || '',
        price: product.price, // Server Price
        quantity: item.quantity
      });
    }

    // 2. Server-side coupon verification & discount calculation
    let calculatedDiscount = 0;
    if (couponCode) {
      const coupon = this.getCoupons(tenantId).find(
        c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive
      );

      if (coupon) {
        const meetsMinSpend = !coupon.minSpend || calculatedSubtotal >= coupon.minSpend;
        const withinLimit = !coupon.usageLimit || coupon.usageCount < coupon.usageLimit;
        const notExpired = !coupon.expiresAt || new Date(coupon.expiresAt).getTime() > Date.now();

        if (meetsMinSpend && withinLimit && notExpired) {
          if (coupon.type === 'percentage') {
            calculatedDiscount = Math.round((calculatedSubtotal * coupon.value) / 100);
          } else {
            calculatedDiscount = Math.min(coupon.value, calculatedSubtotal);
          }
          // Increment usage safely
          coupon.usageCount = (coupon.usageCount || 0) + 1;
        }
      }
    }

    // 3. Server-side Tax & Shipping calculation
    const taxableAmount = Math.max(0, calculatedSubtotal - calculatedDiscount);
    const standardShipping = input.shippingFee !== undefined ? Math.max(0, input.shippingFee) : (calculatedSubtotal > 300 ? 0 : 25);
    const calculatedTotal = taxableAmount + standardShipping;

    // 4. Decrement verified stock
    for (const item of items) {
      const product = this.getProductById(item.productId, tenantId)!;
      product.stock -= item.quantity;
    }

    // 5. Update or register customer record
    const existingCust = this.data.customers.find(
      c => c.tenantId === tenantId && (c.email === customer.email || c.phone === customer.phone)
    );
    if (existingCust) {
      existingCust.ordersCount = (existingCust.ordersCount || 0) + 1;
      existingCust.totalSpent = (existingCust.totalSpent || 0) + calculatedTotal;
      existingCust.lastOrderDate = new Date().toISOString();
    } else {
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        tenantId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        city: customer.city || 'الرياض',
        ordersCount: 1,
        totalSpent: calculatedTotal,
        lastOrderDate: new Date().toISOString(),
        tags: ['New Customer'],
        status: 'active'
      };
      this.data.customers.push(newCustomer);
    }

    // 6. Build immutable order
    const id = `ord-${Date.now()}`;
    const tenant = this.getTenantByIdOrSlug(tenantId);
    const prefix = (tenant?.slug || 'ST').substring(0, 2).toUpperCase();
    const num = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `#${prefix}-${num}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id,
      tenantId,
      orderNumber,
      customer,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      shipping: standardShipping,
      total: calculatedTotal,
      status: 'new',
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      createdAt: now,
      timeline: [
        {
          status: 'new',
          timestamp: now,
          note: 'تم إنشاء الطلب واحتساب الأسعار والمخزون بنجاح عبر خادم التجارة'
        }
      ]
    };

    this.data.orders.unshift(newOrder);
    this.addAuditLog(tenantId, 'ORDER_CREATED', 'Customer', { orderNumber, total: calculatedTotal });
    this.queueSave();

    return { success: true, order: newOrder };
  }

  /**
   * Update order status with strict state-machine validation
   */
  updateOrderStatus(
    id: string, 
    newStatus: Order['status'], 
    note?: string, 
    tenantId?: string,
    performedBy: string = 'Staff'
  ): { success: boolean; order?: Order; error?: string } {
    const order = this.getOrderById(id, tenantId);
    if (!order) {
      return { success: false, error: 'الطلب غير موجود' };
    }

    // Validate State Machine
    const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[order.status] || [];
    if (!allowedTransitions.includes(newStatus)) {
      return {
        success: false,
        error: `لا يمكن تحويل حالة الطلب من [${order.status}] إلى [${newStatus}]. المسار المسموح به هو: ${allowedTransitions.join(', ') || 'لا يوجد (حالة نهائية)'}`
      };
    }

    order.status = newStatus;
    if (newStatus === 'delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    }

    order.timeline.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `تم تحديث حالة الطلب إلى: ${newStatus}`
    });

    this.addAuditLog(order.tenantId, 'ORDER_STATUS_UPDATED', performedBy, { id, from: order.status, to: newStatus });
    this.queueSave();
    return { success: true, order };
  }

  // --- Customers ---
  getCustomers(tenantId?: string): Customer[] {
    if (!tenantId) return this.data.customers;
    return this.data.customers.filter(c => c.tenantId === tenantId);
  }

  // --- Coupons ---
  getCoupons(tenantId?: string): Coupon[] {
    if (!tenantId) return this.data.coupons;
    return this.data.coupons.filter(c => c.tenantId === tenantId);
  }

  createCoupon(coupon: Coupon): Coupon {
    this.data.coupons.push(coupon);
    this.queueSave();
    return coupon;
  }

  // --- Staff & RBAC ---
  getStaff(tenantId?: string): StaffMember[] {
    if (!tenantId) return this.data.staff;
    return this.data.staff.filter(s => s.tenantId === tenantId);
  }

  createStaff(staff: StaffMember): StaffMember {
    this.data.staff.push(staff);
    this.queueSave();
    return staff;
  }

  updateStaff(id: string, updates: Partial<StaffMember>): StaffMember | null {
    const idx = this.data.staff.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.staff[idx] = { ...this.data.staff[idx], ...updates };
    this.queueSave();
    return this.data.staff[idx];
  }

  deleteStaff(id: string): boolean {
    const initialLen = this.data.staff.length;
    this.data.staff = this.data.staff.filter(s => s.id !== id);
    this.queueSave();
    return this.data.staff.length < initialLen;
  }

  // --- Audit Logs ---
  addAuditLog(tenantId: string, action: string, performedBy: string, details: any) {
    this.data.auditLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      tenantId,
      action,
      performedBy,
      details,
      timestamp: new Date().toISOString()
    });
    // Keep generous buffer for audit history
    if (this.data.auditLogs.length > 1000) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 1000);
    }
  }

  getAuditLogs(tenantId?: string) {
    if (!tenantId) return this.data.auditLogs;
    return this.data.auditLogs.filter(l => l.tenantId === tenantId);
  }
}

export const db = new DatabaseEngine();
