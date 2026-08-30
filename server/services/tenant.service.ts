import { tenantRepository, TenantRepository } from '../repositories/tenant.repository.ts';
import { NotFoundError, ConflictError, ValidationError } from '../domain/errors.ts';
import { TenantStore, StoreTheme } from '../../src/types.ts';

export class TenantService {
  constructor(private tenantRepo: TenantRepository = tenantRepository) {}

  public async getAllTenants(): Promise<{ tenants: TenantStore[]; count: number }> {
    const tenants = await this.tenantRepo.findAll();
    return { tenants, count: tenants.length };
  }

  public async getTenantByIdOrSlug(idOrSlug: string): Promise<TenantStore> {
    let tenant = await this.tenantRepo.findById(idOrSlug);
    if (!tenant) {
      tenant = await this.tenantRepo.findBySlug(idOrSlug);
    }
    if (!tenant) {
      throw new NotFoundError(`المتجر (${idOrSlug}) غير موجود`);
    }
    return tenant;
  }

  public async createTenant(data: Partial<TenantStore>): Promise<TenantStore> {
    if (!data.name || !data.slug) {
      throw new ValidationError('اسم المتجر والرابط اللطيف (slug) مطلوبان');
    }

    const existing = await this.tenantRepo.findBySlug(data.slug);
    if (existing) {
      throw new ConflictError(`رابط المتجر (${data.slug}) مستخدم بالفعل`);
    }

    return this.tenantRepo.create({
      ...data,
      name: data.name,
      slug: data.slug
    });
  }

  public async updateTenant(id: string, updates: Partial<TenantStore>): Promise<TenantStore> {
    const updated = await this.tenantRepo.update(id, updates);
    if (!updated) {
      throw new NotFoundError(`المتجر #${id} غير موجود لتحديثه`);
    }
    return updated;
  }

  public async updateTenantTheme(id: string, theme: StoreTheme): Promise<{ theme: StoreTheme; tenant: TenantStore }> {
    const updated = await this.tenantRepo.updateTheme(id, theme);
    if (!updated) {
      throw new NotFoundError(`المتجر #${id} غير موجود لتحديث قالبه`);
    }
    return { theme, tenant: updated };
  }

  public async deleteTenant(id: string): Promise<void> {
    const success = await this.tenantRepo.delete(id);
    if (!success) {
      throw new NotFoundError(`المتجر #${id} غير موجود لحذفه`);
    }
  }
}

export const tenantService = new TenantService();
