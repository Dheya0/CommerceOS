import { 
  Category, 
  Coupon, 
  Customer, 
  Order, 
  Product, 
  StaffMember, 
  StaffRole, 
  TenantStore, 
  StoreTheme 
} from '../types';

const API_BASE = '/api/v1';

class CommerceApiClient {
  private activeTenantId: string = 'tenant-royal-honey';
  private activeRole: StaffRole = 'store_owner';
  private authToken: string = '';

  constructor() {
    // Attempt to hydrate stored token if exists
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('cos_auth_token');
      if (storedToken) {
        this.authToken = storedToken;
      }
    }
  }

  setTenant(tenantId: string) {
    this.activeTenantId = tenantId;
  }

  setRole(role: StaffRole, token?: string) {
    this.activeRole = role;
    if (token) {
      this.authToken = token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cos_auth_token', token);
      }
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-tenant-id': this.activeTenantId,
      ...(options.headers as Record<string, string> || {})
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      console.warn(`[CommerceAPI] ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // --- Auth ---
  async login(role: StaffRole = 'store_owner', email?: string) {
    const res = await this.request<{ success: boolean; user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ role, email, tenantId: this.activeTenantId })
    });
    if (res.token) {
      this.setRole(role, res.token);
    }
    return res;
  }

  async switchRole(role: StaffRole) {
    const res = await this.request<{ success: boolean; role: StaffRole; permissions: any; token: string }>('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role, tenantId: this.activeTenantId })
    });
    if (res.token) {
      this.setRole(role, res.token);
    }
    return res;
  }

  // --- Tenants ---
  async getTenants(): Promise<{ tenants: TenantStore[]; count: number }> {
    return this.request('/tenants');
  }

  async getTenant(idOrSlug: string): Promise<{ tenant: TenantStore }> {
    return this.request(`/tenants/${idOrSlug}`);
  }

  async createTenant(tenant: Partial<TenantStore>): Promise<{ success: boolean; tenant: TenantStore }> {
    return this.request('/tenants', {
      method: 'POST',
      body: JSON.stringify(tenant)
    });
  }

  async updateTenant(id: string, updates: Partial<TenantStore>): Promise<{ success: boolean; tenant: TenantStore }> {
    return this.request(`/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async updateTenantTheme(id: string, theme: StoreTheme): Promise<{ success: boolean; theme: StoreTheme; tenant: TenantStore }> {
    return this.request(`/tenants/${id}/theme`, {
      method: 'PUT',
      body: JSON.stringify({ theme })
    });
  }

  async deleteTenant(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/tenants/${id}`, {
      method: 'DELETE'
    });
  }

  // --- Products ---
  async getProducts(params?: { categoryId?: string; search?: string; inStock?: boolean }): Promise<{ products: Product[]; count: number }> {
    const query = new URLSearchParams();
    if (params?.categoryId) query.append('categoryId', params.categoryId);
    if (params?.search) query.append('search', params.search);
    if (params?.inStock) query.append('inStock', 'true');
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/products${qs}`);
  }

  async createProduct(product: Partial<Product>): Promise<{ success: boolean; product: Product }> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ success: boolean; product: Product }> {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  async restockProduct(id: string, amount: number = 10): Promise<{ success: boolean; product: Product }> {
    return this.request(`/products/${id}/restock`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  }

  async getCategories(): Promise<{ categories: Category[] }> {
    return this.request('/products/categories/all');
  }

  async createCategory(category: Partial<Category>): Promise<{ success: boolean; category: Category }> {
    return this.request('/products/categories/all', {
      method: 'POST',
      body: JSON.stringify(category)
    });
  }

  // --- Orders ---
  async getOrders(status?: string): Promise<{ orders: Order[]; count: number }> {
    const qs = status ? `?status=${status}` : '';
    return this.request(`/orders${qs}`);
  }

  async createOrder(orderData: {
    customer: Order['customer'];
    items: { productId: string; quantity: number }[];
    paymentMethod: Order['paymentMethod'];
    couponCode?: string;
    shippingMethodId?: string;
    bankTransferDetails?: Order['bankTransferDetails'];
  }): Promise<{ success: boolean; order: Order; message: string }> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async updateOrderStatus(id: string, status: Order['status'], note?: string): Promise<{ success: boolean; order: Order }> {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note })
    });
  }

  async updateOrderPaymentStatus(id: string, paymentStatus: Order['paymentStatus'], note?: string): Promise<{ success: boolean; order: Order; message: string }> {
    return this.request(`/orders/${id}/payment`, {
      method: 'PUT',
      body: JSON.stringify({ paymentStatus, note })
    });
  }

  // --- Coupons ---
  async getCoupons(): Promise<{ coupons: Coupon[] }> {
    return this.request('/coupons');
  }

  async createCoupon(coupon: Partial<Coupon>): Promise<{ success: boolean; coupon: Coupon }> {
    return this.request('/coupons', {
      method: 'POST',
      body: JSON.stringify(coupon)
    });
  }

  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; coupon?: Coupon; discountAmount?: number; message?: string; error?: string }> {
    return this.request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal, tenantId: this.activeTenantId })
    });
  }

  // --- Staff ---
  async getStaff(): Promise<{ staff: StaffMember[] }> {
    return this.request('/staff');
  }

  async createStaff(staff: Partial<StaffMember>): Promise<{ success: boolean; staff: StaffMember }> {
    return this.request('/staff', {
      method: 'POST',
      body: JSON.stringify(staff)
    });
  }

  async updateStaff(id: string, updates: Partial<StaffMember>): Promise<{ success: boolean; staff: StaffMember }> {
    return this.request(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deleteStaff(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/staff/${id}`, {
      method: 'DELETE'
    });
  }

  // --- Analytics ---
  async getAnalytics(): Promise<{ metrics: any; dailyChart: any[]; auditLogs: any[] }> {
    return this.request('/analytics');
  }

  async getPlatformAnalytics(): Promise<any> {
    return this.request('/analytics/platform');
  }
}

export const api = new CommerceApiClient();
