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

  setTenant(tenantId: string) {
    this.activeTenantId = tenantId;
  }

  setRole(role: StaffRole, token?: string) {
    this.activeRole = role;
    if (token) this.authToken = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-tenant-id': this.activeTenantId,
      'x-staff-role': this.activeRole,
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
    return this.request<{ success: boolean; user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ role, email })
    });
  }

  async switchRole(role: StaffRole) {
    return this.request<{ success: boolean; role: StaffRole; permissions: any; token: string }>('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
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
      body: JSON.stringify({ ...product, tenantId: this.activeTenantId })
    });
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ success: boolean; product: Product }> {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...updates, tenantId: this.activeTenantId })
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
      body: JSON.stringify({ ...category, tenantId: this.activeTenantId })
    });
  }

  // --- Orders ---
  async getOrders(status?: string): Promise<{ orders: Order[]; count: number }> {
    const qs = status ? `?status=${status}` : '';
    return this.request(`/orders${qs}`);
  }

  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>): Promise<{ success: boolean; order: Order; message: string }> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ ...orderData, tenantId: this.activeTenantId })
    });
  }

  async updateOrderStatus(id: string, status: Order['status'], note?: string): Promise<{ success: boolean; order: Order }> {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note })
    });
  }

  // --- Coupons ---
  async getCoupons(): Promise<{ coupons: Coupon[] }> {
    return this.request('/coupons');
  }

  async createCoupon(coupon: Partial<Coupon>): Promise<{ success: boolean; coupon: Coupon }> {
    return this.request('/coupons', {
      method: 'POST',
      body: JSON.stringify({ ...coupon, tenantId: this.activeTenantId })
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
      body: JSON.stringify({ ...staff, tenantId: this.activeTenantId })
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
