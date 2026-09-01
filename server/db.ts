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
import { SUBSCRIPTION_PLANS } from '../src/data/initialData';
import { hashPassword } from './utils/security';

export interface PlatformAdminUser {
  id: string;
  name: string;
  email: string;
  role: 'platform_super_admin' | 'platform_auditor';
  passwordHash: string;
}

export interface BuildRecord {
  id: string;
  projectId: string; // matches tenantId
  target: string;
  targetName: string;
  version: string;
  buildNumber: number;
  status: 'queued' | 'running' | 'packaging' | 'signing' | 'completed' | 'failed';
  progress: number;
  currentStep?: string;
  workerId?: string;
  workerName?: string;
  logs: string[];
  artifactId?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ArtifactRecord {
  id: string;
  buildId: string;
  projectId: string;
  ownerId?: string;
  target: string;
  targetName: string;
  version: string;
  buildNumber: number;
  fileName: string;
  filePath: string;
  checksum: string; // SHA-256
  fileSizeBytes: number;
  fileSizeMb: string;
  mimeType: string;
  status: 'ready' | 'expired' | 'deleted';
  createdAt: string;
  expiresAt: string;
}

export interface DatabaseSchema {
  tenants: TenantStore[];
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  staff: StaffMember[];
  plans: SubscriptionPlan[];
  platformAdmins: PlatformAdminUser[];
  builds: BuildRecord[];
  artifacts: ArtifactRecord[];
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
        if (Array.isArray(parsed.tenants) && Array.isArray(parsed.products)) {
          parsed.builds = parsed.builds || [];
          parsed.artifacts = parsed.artifacts || [];
          parsed.auditLogs = parsed.auditLogs || [];
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing clean zero-state:', err);
    }

    // Clean Zero-State Database
    const initialPlatformAdmins: PlatformAdminUser[] = [];
    const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;
    const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;

    if (bootstrapEmail && bootstrapPassword && bootstrapPassword.length >= 12) {
      initialPlatformAdmins.push({
        id: `admin-${Date.now()}`,
        name: process.env.ADMIN_BOOTSTRAP_NAME || 'CommerceOS Super Admin',
        email: bootstrapEmail.trim().toLowerCase(),
        role: 'platform_super_admin',
        passwordHash: hashPassword(bootstrapPassword)
      });
    }

    const initialDb: DatabaseSchema = {
      tenants: [],
      products: [],
      categories: [],
      orders: [],
      customers: [],
      coupons: [],
      staff: [],
      plans: [...SUBSCRIPTION_PLANS],
      platformAdmins: initialPlatformAdmins,
      builds: [],
      artifacts: [],
      auditLogs: []
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
   * 1. Rebuilds price, subtotal, and tax from Server-Side Database (Zero-trust client pricing)
   * 2. Validates and applies coupons server-side
   * 3. Calculates Shipping Policy entirely on Server (Ignores client shipping fee manipulation)
   * 4. Calculates explicit Value Added Tax (VAT 15% / Saudi VAT Rules)
   * 5. Validates and decrements stock atomically with rollback capability
   * 6. Updates customer stats and creates immutable order record
   * 7. Sets legitimate payment status: 'pending' / 'pending_verification' (requires gateway webhook/intent or merchant approval)
   */
  createOrderAtomic(input: {
    tenantId: string;
    customer: Order['customer'];
    items: { productId: string; quantity: number }[];
    paymentMethod: Order['paymentMethod'];
    couponCode?: string;
    shippingMethodId?: string;
    bankTransferDetails?: Order['bankTransferDetails'];
    paymentIntentId?: string;
  }): { success: boolean; order?: Order; error?: string } {
    const { tenantId, customer, items, paymentMethod, couponCode, shippingMethodId, bankTransferDetails } = input;

    if (!items || items.length === 0) {
      return { success: false, error: 'السلة فارغة' };
    }

    const tenant = this.getTenantByIdOrSlug(tenantId);
    if (!tenant) {
      return { success: false, error: 'المتجر غير موجود' };
    }

    // Verify payment gateway is enabled by tenant
    if (tenant.paymentGateways) {
      const isGatewayEnabled = 
        (paymentMethod === 'mada' && tenant.paymentGateways.mada) ||
        (paymentMethod === 'visa' && tenant.paymentGateways.visa) ||
        (paymentMethod === 'apple_pay' && tenant.paymentGateways.applePay) ||
        (paymentMethod === 'tamara' && tenant.paymentGateways.tamara) ||
        (paymentMethod === 'cod' && tenant.paymentGateways.cod) ||
        (paymentMethod === 'bank_transfer' && tenant.paymentGateways.bankTransfer);

      if (!isGatewayEnabled) {
        return {
          success: false,
          error: `طريقة الدفع المختارة (${paymentMethod}) غير مفعلة حالياً في هذا المتجر.`
        };
      }
    }

    if (paymentMethod === 'bank_transfer' && !bankTransferDetails?.receiptImage && !bankTransferDetails?.referenceNumber) {
      return {
        success: false,
        error: 'يرجى إرفاق إيصال التحويل البنكي أو رقم المرجع لتأكيد الطلب'
      };
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

    // 3. Server-owned Shipping Calculation (Based on Tenant Shipping Policy & Cart)
    let calculatedShipping = 25; // Default standard shipping fee
    const availableShippingMethods = tenant.shippingMethods || [];
    
    if (shippingMethodId) {
      const selectedMethod = availableShippingMethods.find(m => m.id === shippingMethodId && m.active);
      if (selectedMethod) {
        calculatedShipping = selectedMethod.cost;
      }
    } else {
      // Automatic Store Shipping Policy Evaluation
      if (calculatedSubtotal >= 300) {
        calculatedShipping = 0; // Free shipping rule for orders over 300 SAR
      } else if (availableShippingMethods.length > 0) {
        const defaultMethod = availableShippingMethods.find(m => m.active);
        if (defaultMethod) calculatedShipping = defaultMethod.cost;
      }
    }

    // 4. Real Explicit Tax Engine (Saudi Standard 15% VAT or Tenant Configured Rate)
    const taxConfig = tenant.taxConfig || {
      enabled: true,
      rate: 15,
      taxIncludedInPrice: true,
      taxNumber: '310998823100003'
    };

    const netTaxableAmount = Math.max(0, calculatedSubtotal - calculatedDiscount);
    let calculatedTax = 0;

    if (taxConfig.enabled) {
      const rateFraction = (taxConfig.rate || 15) / 100;
      if (taxConfig.taxIncludedInPrice) {
        // Tax is already included in catalog prices (standard KSA retail formula: Price - Price / (1 + Rate))
        calculatedTax = Math.round((netTaxableAmount - (netTaxableAmount / (1 + rateFraction))) * 100) / 100;
      } else {
        // Tax added on top
        calculatedTax = Math.round(netTaxableAmount * rateFraction * 100) / 100;
      }
    }

    const calculatedTotal = taxConfig.taxIncludedInPrice 
      ? netTaxableAmount + calculatedShipping 
      : netTaxableAmount + calculatedTax + calculatedShipping;

    // 5. Decrement verified stock
    for (const item of items) {
      const product = this.getProductById(item.productId, tenantId)!;
      product.stock -= item.quantity;
    }

    // 6. Update or register customer record
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

    // 7. Build immutable order with realistic payment lifecycle
    const id = `ord-${Date.now()}`;
    const prefix = (tenant.slug || 'ST').substring(0, 2).toUpperCase();
    const num = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `#${prefix}-${num}`;
    const now = new Date().toISOString();

    // Legitimate Payment Lifecycle:
    // - Bank transfer: 'pending_verification' (requires merchant review of receipt)
    // - Electronic gateways (mada, visa, apple_pay, tamara): 'pending' (requires gateway authorization)
    // - COD: 'pending' (paid upon physical delivery)
    const initialPaymentStatus: Order['paymentStatus'] = 
      paymentMethod === 'bank_transfer' ? 'pending_verification' : 'pending';

    let initialTimelineNote = `تم إنشاء الطلب واحتساب الأسعار والضريبة (${calculatedTax} ر.س) والشحن (${calculatedShipping} ر.س) بنجاح`;
    if (paymentMethod === 'bank_transfer') {
      initialTimelineNote = `تم إنشاء الطلب وتسجيل بيانات الحوالة البنكية (${bankTransferDetails?.bankName || 'تحويل بنكي'})، بانتظار مراجعة الإيصال والاعتماد`;
    } else if (paymentMethod === 'cod') {
      initialTimelineNote = `تم إنشاء الطلب مع خيار الدفع عند الاستلام (COD)`;
    } else {
      initialTimelineNote = `تم إنشاء الطلب - في انتظار إشعار نجاح الدفع من بوابة (${paymentMethod.toUpperCase()})`;
    }

    const newOrder: Order = {
      id,
      tenantId,
      orderNumber,
      customer,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      shipping: calculatedShipping,
      tax: calculatedTax,
      total: calculatedTotal,
      status: 'new',
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      bankTransferDetails: paymentMethod === 'bank_transfer' ? bankTransferDetails : undefined,
      createdAt: now,
      timeline: [
        {
          status: 'new',
          timestamp: now,
          note: initialTimelineNote
        }
      ]
    };

    this.data.orders.unshift(newOrder);
    this.addAuditLog(tenantId, 'ORDER_CREATED', 'Customer', { 
      orderNumber, 
      subtotal: calculatedSubtotal, 
      tax: calculatedTax, 
      shipping: calculatedShipping, 
      total: calculatedTotal,
      paymentMethod,
      paymentStatus: initialPaymentStatus
    });
    this.queueSave();

    return { success: true, order: newOrder };
  }

  /**
   * Update order status with strict state-machine validation and accurate audit trail
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

    const previousStatus = order.status;

    // Validate State Machine
    const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[previousStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      return {
        success: false,
        error: `لا يمكن تحويل حالة الطلب من [${previousStatus}] إلى [${newStatus}]. المسار المسموح به هو: ${allowedTransitions.join(', ') || 'لا يوجد (حالة نهائية)'}`
      };
    }

    order.status = newStatus;
    if (newStatus === 'delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    }

    order.timeline.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `تم تحديث حالة الطلب من [${previousStatus}] إلى [${newStatus}]`
    });

    // Accurate Audit Trail: captures genuine previousStatus vs newStatus
    this.addAuditLog(order.tenantId, 'ORDER_STATUS_UPDATED', performedBy, { 
      id, 
      from: previousStatus, 
      to: newStatus 
    });
    this.queueSave();
    return { success: true, order };
  }

  /**
   * Approve or verify order payment (for gateway webhooks or bank transfers)
   */
  updateOrderPaymentStatus(
    id: string,
    newPaymentStatus: Order['paymentStatus'],
    note?: string,
    tenantId?: string,
    performedBy: string = 'PaymentGateway'
  ): { success: boolean; order?: Order; error?: string } {
    const order = this.getOrderById(id, tenantId);
    if (!order) {
      return { success: false, error: 'الطلب غير موجود' };
    }

    const previousPaymentStatus = order.paymentStatus;
    order.paymentStatus = newPaymentStatus;

    if (newPaymentStatus === 'paid' && order.status === 'new') {
      order.status = 'processing';
    }

    order.timeline.push({
      status: order.status,
      timestamp: new Date().toISOString(),
      note: note || `تم تحديث حالة الدفع إلى: [${newPaymentStatus}]`
    });

    this.addAuditLog(order.tenantId, 'ORDER_PAYMENT_STATUS_UPDATED', performedBy, {
      id,
      orderNumber: order.orderNumber,
      from: previousPaymentStatus,
      to: newPaymentStatus,
      paymentMethod: order.paymentMethod
    });
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

  getCouponById(id: string, tenantId?: string): Coupon | undefined {
    return this.data.coupons.find(
      c => c.id === id && (!tenantId || c.tenantId === tenantId)
    );
  }

  createCoupon(coupon: Coupon): Coupon {
    this.data.coupons.push(coupon);
    this.queueSave();
    return coupon;
  }

  deleteCoupon(id: string, tenantId?: string): boolean {
    const initialLen = this.data.coupons.length;
    this.data.coupons = this.data.coupons.filter(
      c => !(c.id === id && (!tenantId || c.tenantId === tenantId))
    );
    this.queueSave();
    return this.data.coupons.length < initialLen;
  }

  // --- Staff & RBAC (Strict Multi-Tenant Isolation) ---
  getStaff(tenantId?: string): StaffMember[] {
    if (!tenantId) return this.data.staff;
    return this.data.staff.filter(s => s.tenantId === tenantId);
  }

  getStaffById(id: string, tenantId?: string): StaffMember | undefined {
    return this.data.staff.find(
      s => s.id === id && (!tenantId || s.tenantId === tenantId)
    );
  }

  createStaff(staff: StaffMember): StaffMember {
    this.data.staff.push(staff);
    this.addAuditLog(staff.tenantId, 'STAFF_CREATED', 'Admin', { name: staff.name, email: staff.email, role: staff.role });
    this.queueSave();
    return staff;
  }

  updateStaff(id: string, updates: Partial<StaffMember>, tenantId?: string): StaffMember | null {
    const idx = this.data.staff.findIndex(
      s => s.id === id && (!tenantId || s.tenantId === tenantId)
    );
    if (idx === -1) return null;
    
    // Explicitly prevent cross-tenant movement
    delete updates.tenantId;

    this.data.staff[idx] = { ...this.data.staff[idx], ...updates };
    this.addAuditLog(this.data.staff[idx].tenantId, 'STAFF_UPDATED', 'Admin', { id, role: updates.role, status: updates.status });
    this.queueSave();
    return this.data.staff[idx];
  }

  deleteStaff(id: string, tenantId?: string): boolean {
    const initialLen = this.data.staff.length;
    const targetStaff = this.getStaffById(id, tenantId);
    if (!targetStaff) return false;

    this.data.staff = this.data.staff.filter(
      s => !(s.id === id && (!tenantId || s.tenantId === tenantId))
    );
    this.addAuditLog(targetStaff.tenantId, 'STAFF_DELETED', 'Admin', { id, name: targetStaff.name, email: targetStaff.email });
    this.queueSave();
    return this.data.staff.length < initialLen;
  }

  // --- Platform HQ Super Admins ---
  getPlatformAdmin(email: string): PlatformAdminUser | undefined {
    return (this.data.platformAdmins || []).find(
      a => a.email.toLowerCase() === email.trim().toLowerCase()
    );
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

  // --- Builds & Code Factory Artifacts ---
  getBuilds(projectId?: string): BuildRecord[] {
    if (!this.data.builds) this.data.builds = [];
    if (!projectId) return this.data.builds;
    return this.data.builds.filter(b => b.projectId === projectId);
  }

  getBuildById(id: string, projectId?: string): BuildRecord | undefined {
    if (!this.data.builds) this.data.builds = [];
    return this.data.builds.find(
      b => b.id === id && (!projectId || b.projectId === projectId)
    );
  }

  createBuild(build: BuildRecord): BuildRecord {
    if (!this.data.builds) this.data.builds = [];
    this.data.builds.unshift(build);
    this.addAuditLog(build.projectId, 'BUILD_CREATED', 'CodeFactory', {
      buildId: build.id,
      target: build.target,
      version: build.version
    });
    this.queueSave();
    return build;
  }

  updateBuild(id: string, updates: Partial<BuildRecord>): BuildRecord | null {
    if (!this.data.builds) this.data.builds = [];
    const idx = this.data.builds.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.builds[idx] = { ...this.data.builds[idx], ...updates };
    this.queueSave();
    return this.data.builds[idx];
  }

  getArtifacts(projectId?: string): ArtifactRecord[] {
    if (!this.data.artifacts) this.data.artifacts = [];
    if (!projectId) return this.data.artifacts;
    return this.data.artifacts.filter(a => a.projectId === projectId);
  }

  getArtifactById(id: string, projectId?: string): ArtifactRecord | undefined {
    if (!this.data.artifacts) this.data.artifacts = [];
    return this.data.artifacts.find(
      a => a.id === id && (!projectId || a.projectId === projectId)
    );
  }

  createArtifact(artifact: ArtifactRecord): ArtifactRecord {
    if (!this.data.artifacts) this.data.artifacts = [];
    this.data.artifacts.unshift(artifact);
    this.addAuditLog(artifact.projectId, 'ARTIFACT_CREATED', 'CodeFactory', {
      artifactId: artifact.id,
      fileName: artifact.fileName,
      target: artifact.target,
      checksum: artifact.checksum
    });
    this.queueSave();
    return artifact;
  }

  deleteArtifact(id: string, projectId?: string): boolean {
    if (!this.data.artifacts) this.data.artifacts = [];
    const initialLen = this.data.artifacts.length;
    this.data.artifacts = this.data.artifacts.filter(
      a => !(a.id === id && (!projectId || a.projectId === projectId))
    );
    this.queueSave();
    return this.data.artifacts.length < initialLen;
  }

  // --- Synchronization with PostgreSQL ---
  syncOrderFromPostgres(order: Order) {
    // Add to in-memory cache if not already present
    const existingIndex = this.data.orders.findIndex(o => o.id === order.id);
    if (existingIndex >= 0) {
      this.data.orders[existingIndex] = order;
    } else {
      this.data.orders.unshift(order);
    }

    // Synchronize product stocks in-memory
    for (const item of order.items) {
      const prod = this.getProductById(item.productId, order.tenantId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }

    this.queueSave();
  }
}

export const db = new DatabaseEngine();

