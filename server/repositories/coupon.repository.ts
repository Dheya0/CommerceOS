import { db } from '../db.ts';
import { Coupon } from '../../src/types.ts';

export class CouponRepository {
  public async findByTenant(tenantId: string): Promise<Coupon[]> {
    return db.getCoupons(tenantId);
  }

  public async findByCode(code: string, tenantId: string): Promise<Coupon | undefined> {
    return db.getCoupons(tenantId).find(
      c => c.code.toUpperCase() === code.trim().toUpperCase()
    );
  }

  public async create(coupon: Partial<Coupon> & { code: string; tenantId: string }): Promise<Coupon> {
    const fullCoupon: Coupon = {
      id: coupon.id || `cpn-${Date.now()}`,
      tenantId: coupon.tenantId,
      code: coupon.code.toUpperCase(),
      type: coupon.type || 'percentage',
      value: coupon.value || 10,
      minSpend: coupon.minSpend,
      usageLimit: coupon.usageLimit,
      usageCount: coupon.usageCount || 0,
      expiresAt: coupon.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: coupon.isActive !== undefined ? coupon.isActive : true
    };
    return db.createCoupon(fullCoupon);
  }

  public async delete(id: string, tenantId: string): Promise<boolean> {
    return db.deleteCoupon(id, tenantId);
  }
}

export const couponRepository = new CouponRepository();
