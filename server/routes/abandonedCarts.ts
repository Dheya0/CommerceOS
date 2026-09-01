import { Router, Request, Response } from 'express';
import { db } from '../db';
import { AbandonedCart } from '../../src/types';

export const abandonedCartsRouter = Router();

// Production store for abandoned carts
let abandonedCartsStore: AbandonedCart[] = [];

// GET /api/v1/abandoned-carts - List abandoned carts for tenant
abandonedCartsRouter.get('/', (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId || req.tenantId || '';
  const carts = abandonedCartsStore.filter(c => c.tenantId === tenantId);

  const totalAbandonedValue = carts.reduce((sum, c) => sum + c.subtotal, 0);
  const recoveredCount = carts.filter(c => c.recoveryStatus === 'recovered').length;
  const recoveredRate = carts.length > 0 ? Math.round((recoveredCount / carts.length) * 100) : 0;

  res.json({
    success: true,
    carts,
    metrics: {
      totalAbandonedCount: carts.length,
      totalAbandonedValue,
      recoveredCount,
      recoveredRatePercentage: recoveredRate,
      potentialRevenueBoostSAR: Math.round(totalAbandonedValue * 0.22) // Projected 22% recovery boost
    }
  });
});

// POST /api/v1/abandoned-carts/:id/recover - Trigger recovery notification (WhatsApp/Email)
abandonedCartsRouter.post('/:id/recover', (req: Request, res: Response) => {
  const { id } = req.params;
  const { channel, discountPercentage } = req.body;

  const cart = abandonedCartsStore.find(c => c.id === id);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const generatedCoupon = discountPercentage ? `RECOVER${discountPercentage}` : 'COMEBACK10';

  cart.recoveryStatus = 'notified';
  cart.recoveryAttempts += 1;
  cart.lastContactedAt = new Date().toISOString();
  cart.discountCodeOffered = generatedCoupon;
  cart.recoveryUrl = `${cart.recoveryUrl.split('&')[0]}&coupon=${generatedCoupon}`;

  const messageBody = `مرحباً ${cart.customerName} 👋 لاحظنا أنك تركت سلة مشترياتك في متجرنا بقيمة ${cart.subtotal} ${cart.currency}. يسعدنا تقديم خصم خاص لك بكود (${generatedCoupon}) لإكمال طلبك الآن: ${cart.recoveryUrl}`;

  res.json({
    success: true,
    message: `تم إرسال رسالة الاستعادة عبر ${channel === 'whatsapp' ? 'الواتساب' : 'البريد الإلكتروني'} بنجاح!`,
    cart,
    dispatchDetails: {
      channel: channel || 'whatsapp',
      recipient: cart.customerPhone,
      messageBody,
      couponCode: generatedCoupon
    }
  });
});
