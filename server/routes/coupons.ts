import { Router } from 'express';
import { requirePermission } from '../middleware/auth.ts';
import { couponController } from '../controllers/coupon.controller.ts';
import { validateBody } from '../validators/validator.ts';
import { CreateCouponSchema, ValidateCouponSchema } from '../validators/dtos.ts';

export const couponsRouter = Router();

// GET /api/v1/coupons - List coupons (RBAC guarded)
couponsRouter.get('/', requirePermission('coupons'), couponController.getCoupons);

// POST /api/v1/coupons - Create coupon (RBAC guarded)
couponsRouter.post('/', requirePermission('coupons'), validateBody(CreateCouponSchema), couponController.createCoupon);

// DELETE /api/v1/coupons/:id - Delete coupon (RBAC guarded)
couponsRouter.delete('/:id', requirePermission('coupons'), couponController.deleteCoupon);

// POST /api/v1/coupons/validate - Public Storefront Coupon Validation
couponsRouter.post('/validate', validateBody(ValidateCouponSchema), couponController.validateCoupon);
