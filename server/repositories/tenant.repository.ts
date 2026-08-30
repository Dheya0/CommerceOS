import { db } from '../db.ts';
import { TenantStore, StoreTheme } from '../../src/types.ts';
import { INITIAL_TENANTS } from '../../src/data/initialData.ts';

export class TenantRepository {
  public async findAll(): Promise<TenantStore[]> {
    return db.getTenants();
  }

  public async findById(id: string): Promise<TenantStore | undefined> {
    return db.getTenantByIdOrSlug(id);
  }

  public async findBySlug(slug: string): Promise<TenantStore | undefined> {
    return db.getTenantByIdOrSlug(slug);
  }

  public async create(tenant: Partial<TenantStore> & { name: string; slug: string }): Promise<TenantStore> {
    const defaultTheme = INITIAL_TENANTS[0]?.theme;
    const fullTenant: TenantStore = {
      id: tenant.id || `tenant-${Date.now()}`,
      name: tenant.name,
      nameEn: tenant.nameEn || tenant.name,
      slug: tenant.slug,
      customDomain: tenant.customDomain,
      customDomainVerified: tenant.customDomainVerified || false,
      domain: tenant.domain || `${tenant.slug}.commerceos.app`,
      businessType: tenant.businessType || 'general',
      description: tenant.description || '',
      descriptionEn: tenant.descriptionEn || '',
      logo: tenant.logo || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&auto=format&fit=crop&q=80',
      logoIcon: tenant.logoIcon || 'Store',
      slogan: tenant.slogan,
      sloganEn: tenant.sloganEn,
      currency: tenant.currency || 'SAR',
      currencySymbol: tenant.currencySymbol || 'ر.س',
      plan: tenant.plan || 'business',
      status: tenant.status || 'active',
      createdAt: tenant.createdAt || new Date().toISOString(),
      contact: tenant.contact || {
        email: 'store@commerceos.app',
        phone: '+966500000000',
        city: 'الرياض',
        country: 'المملكة العربية السعودية'
      },
      social: tenant.social || {},
      theme: tenant.theme || defaultTheme,
      sections: tenant.sections || [],
      pwaConfig: tenant.pwaConfig || {
        appName: tenant.name,
        shortName: tenant.name,
        themeColor: '#D4A017',
        backgroundColor: '#FFFFFF',
        enablePush: true
      },
      paymentGateways: tenant.paymentGateways || {
        mada: true,
        applePay: true,
        visa: true,
        tamara: true,
        tabby: true,
        cod: true,
        bankTransfer: true
      },
      shippingMethods: tenant.shippingMethods || [
        {
          id: 'ship-std',
          name: 'شحن سريع قياسي',
          nameEn: 'Standard Express Shipping',
          cost: 25,
          estimatedDays: '2-4 أيام',
          active: true
        }
      ]
    };
    return db.createTenant(fullTenant);
  }

  public async update(id: string, updates: Partial<TenantStore>): Promise<TenantStore | null> {
    return db.updateTenant(id, updates);
  }

  public async updateTheme(id: string, theme: StoreTheme): Promise<TenantStore | null> {
    return db.updateTenantTheme(id, theme);
  }

  public async delete(id: string): Promise<boolean> {
    return db.deleteTenant(id);
  }
}

export const tenantRepository = new TenantRepository();
