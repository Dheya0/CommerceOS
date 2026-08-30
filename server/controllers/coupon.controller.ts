import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller.ts';
import { couponService, CouponService } from '../services/coupon.service.ts';

export class CouponController extends BaseController {
  constructor(private couponSvc: CouponService = couponService) {
    super();
  }

  public getCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const coupons = await this.couponSvc.getCoupons(tenantId);
      this.sendSuccess(res, { coupons });
    } catch (err) {
      next(err);
    }
  };

  public createCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const coupon = await this.couponSvc.createCoupon(req.body, tenantId);
      this.sendCreated(res, { coupon }, 'تم إنشاء كوبون الخصم بنجاح');
    } catch (err) {
      next(err);
    }
  };

  public deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tenantId = req.user!.tenantId;
      await this.couponSvc.deleteCoupon(id, tenantId);
      this.sendSuccess(res, { message: 'تم حذف الكوبون بنجاح' });
    } catch (err) {
      next(err);
    }
  };

  public validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, subtotal } = req.body;
      const tenantId = req.tenantId || (req.user ? req.user.tenantId : 'tenant-royal-honey');
      const result = await this.couponSvc.validateCoupon(code, Number(subtotal) || 0, tenantId);
      this.sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  };
}

export const couponController = new CouponController();
