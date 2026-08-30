import { couponRepository, CouponRepository } from '../repositories/coupon.repository.ts';
import { NotFoundError, ValidationError, ConflictError } from '../domain/errors.ts';
import { Coupon } from '../../src/types.ts';

export class CouponService {
  constructor(private couponRepo: CouponRepository = couponRepository) {}

  public async getCoupons(tenantId: string): Promise<Coupon[]> {
    return this.couponRepo.findByTenant(tenantId);
  }

  public async createCoupon(couponData: Partial<Coupon>, tenantId: string): Promise<Coupon> {
    if (!couponData.code || couponData.value === undefined) {
      throw new ValidationError('كود الكوبون وقيمة الخصم مطلوبان');
    }

    const cleanCode = couponData.code.trim().toUpperCase();
    const existing = await this.couponRepo.findByCode(cleanCode, tenantId);
    if (existing) {
      throw new ConflictError(`كوبون الخصم (${cleanCode}) موجود مسبقاً في هذا المتجر`);
    }

    return this.couponRepo.create({
      ...couponData,
      code: cleanCode,
      tenantId
    });
  }

  public async deleteCoupon(id: string, tenantId: string): Promise<void> {
    const success = await this.couponRepo.delete(id, tenantId);
    if (!success) {
      throw new NotFoundError(`الكوبون #${id} غير موجود لحذفه`);
    }
  }

  public async validateCoupon(code: string, subtotal: number, tenantId: string) {
    if (!code) {
      throw new ValidationError('كود الكوبون مطلوب');
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await this.couponRepo.findByCode(cleanCode, tenantId);

    if (!coupon || !coupon.isActive) {
      return {
        valid: false,
        error: 'كود الكوبون غير صالح أو غير مفعل في هذا المتجر'
      };
    }

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return {
        valid: false,
        error: `الحد الأدنى للطلب لتفعيل هذا الكوبون هو ${coupon.minSpend} ر.س`
      };
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discountAmount = Math.min(coupon.value, subtotal);
    }

    return {
      valid: true,
      coupon,
      discountAmount,
      message: `تم تفعيل الخصم (${coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value} ر.س`}) بنجاح!`
    };
  }
}

export const couponService = new CouponService();
