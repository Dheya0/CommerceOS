import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requirePermission } from '../middleware/auth';
import { Coupon } from '../../src/types';

export const couponsRouter = Router();

// GET /api/v1/coupons - List coupons (RBAC guarded: 'coupons')
couponsRouter.get('/', requirePermission('coupons'), (req: Request, res: Response) => {
  const tenantId = req.user!.tenantId;
  const coupons = db.getCoupons(tenantId);
  res.json({ coupons });
});

// POST /api/v1/coupons - Create coupon (RBAC guarded: 'coupons')
couponsRouter.post('/', requirePermission('coupons'), (req: Request, res: Response) => {
  const tenantId = req.user!.tenantId;
  const couponData: Coupon = req.body;

  if (!couponData.code || couponData.value === undefined) {
    return res.status(400).json({ error: 'Missing code or value' });
  }

  const id = couponData.id || `cpn-${Date.now()}`;
  const newCoupon: Coupon = {
    ...couponData,
    id,
    tenantId,
    code: couponData.code.toUpperCase().trim(),
    type: couponData.type || 'percentage',
    value: Number(couponData.value),
    usageCount: couponData.usageCount || 0,
    expiresAt: couponData.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: couponData.isActive !== false
  };

  const created = db.createCoupon(newCoupon);
  res.status(201).json({
    success: true,
    coupon: created
  });
});

// POST /api/v1/coupons/validate - Validate coupon for cart (Storefront accessible)
couponsRouter.post('/validate', (req: Request, res: Response) => {
  const { code, subtotal = 0 } = req.body;
  const tenantId = req.body.tenantId || req.tenantId;

  if (!code) {
    return res.status(400).json({ valid: false, error: 'الرجاء إدخال كود الخصم' });
  }

  const coupons = db.getCoupons(tenantId);
  const matched = coupons.find(
    c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
  );

  if (!matched) {
    return res.status(404).json({ valid: false, error: 'كود الخصم غير موجود أو منتهي الصلاحية' });
  }

  if (matched.usageLimit && matched.usageCount >= matched.usageLimit) {
    return res.status(400).json({ valid: false, error: 'تم استنفاد الحد الأقصى لاستخدام هذا الكود' });
  }

  if (matched.minSpend && subtotal < matched.minSpend) {
    return res.status(400).json({ 
      valid: false, 
      error: `الحد الأدنى للطلب للاستفادة من الكود هو ${matched.minSpend} ر.س` 
    });
  }

  let discountAmount = 0;
  if (matched.type === 'percentage') {
    discountAmount = Math.round((subtotal * matched.value) / 100);
  } else {
    discountAmount = Math.min(matched.value, subtotal);
  }

  res.json({
    valid: true,
    coupon: matched,
    discountAmount,
    message: `تم تطبيق الخصم بنجاح (${matched.type === 'percentage' ? `${matched.value}%` : `${matched.value} ر.س`})`
  });
});
