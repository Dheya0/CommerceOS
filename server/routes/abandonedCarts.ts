import { Router, Request, Response } from 'express';
import { db } from '../db';
import { AbandonedCart } from '../../src/types';

export const abandonedCartsRouter = Router();

// Seed initial abandoned carts for demonstration
let abandonedCartsStore: AbandonedCart[] = [
  {
    id: 'cart-ab-101',
    tenantId: 'tenant-royal-honey',
    customerName: 'فيصل العتيبي',
    customerPhone: '+966501234567',
    customerEmail: 'faisal.otb@gmail.com',
    items: [
      {
        product: {
          id: 'prod-101',
          name: 'عسل سدر ملكي فاخر دوعني',
          price: 240,
          images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800'],
          stock: 45,
          sku: 'RHD-001',
          tenantId: 'tenant-royal-honey',
          description: 'عسل سدر طبيعي 100%'
        } as any,
        quantity: 2
      }
    ],
    subtotal: 480,
    currency: 'SAR',
    abandonedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
    recoveryStatus: 'abandoned',
    recoveryAttempts: 0,
    recoveryUrl: 'https://royal-honey.commerceos.app/checkout?resume=cart-ab-101'
  },
  {
    id: 'cart-ab-102',
    tenantId: 'tenant-royal-honey',
    customerName: 'سارة الشمري',
    customerPhone: '+966559876543',
    customerEmail: 'sarah.sh@outlook.com',
    items: [
      {
        product: {
          id: 'prod-103',
          name: 'عسل حبة البركة العلاجي',
          price: 180,
          images: ['https://images.unsplash.com/photo-1587049352847-4a222e784d39?auto=format&fit=crop&q=80&w=800'],
          stock: 28,
          sku: 'RHB-003',
          tenantId: 'tenant-royal-honey',
          description: 'عسل مع حبة البركة'
        } as any,
        quantity: 1
      }
    ],
    subtotal: 180,
    currency: 'SAR',
    abandonedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
    recoveryStatus: 'notified',
    recoveryAttempts: 1,
    lastContactedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    discountCodeOffered: 'COMEBACK10',
    recoveryUrl: 'https://royal-honey.commerceos.app/checkout?resume=cart-ab-102&code=COMEBACK10'
  }
];

// GET /api/v1/abandoned-carts - List abandoned carts for tenant
abandonedCartsRouter.get('/', (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId || req.tenantId || 'tenant-royal-honey';
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
