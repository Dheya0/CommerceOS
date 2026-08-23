import { Router, Request, Response } from 'express';
import { NotificationLog } from '../../src/types';

export const notificationsRouter = Router();

const notificationLogsStore: NotificationLog[] = [
  {
    id: 'ntf-01',
    tenantId: 'tenant-royal-honey',
    channel: 'whatsapp',
    recipient: '+966501112233',
    recipientName: 'عبدالله السبيعي',
    triggerEvent: 'order_created',
    templateName: 'order_confirmation_ar',
    messageBody: 'عزيزي عبدالله السبيعي، تم استلام طلبك رقم (#ORD-101) بنجاح بقيمة 540 ريال. سنوافيك برابط التتبع فور الشحن 🍯',
    status: 'delivered',
    sentAt: '2026-08-21 21:15',
    provider: 'whatsapp_cloud_api'
  },
  {
    id: 'ntf-02',
    tenantId: 'tenant-royal-honey',
    channel: 'sms',
    recipient: '+966554443322',
    recipientName: 'نورة القحطاني',
    triggerEvent: 'order_shipped',
    templateName: 'order_shipping_tracking_ar',
    messageBody: 'تم شحن طلبك (#ORD-102) عبر أرامكس! رقم الشحنة: 394829104. التتبع: https://track.aramex.com/394829104',
    status: 'delivered',
    sentAt: '2026-08-21 18:30',
    provider: 'unifonic'
  }
];

// GET /api/v1/notifications/logs - List notification dispatch logs
notificationsRouter.get('/logs', (req: Request, res: Response) => {
  res.json({
    success: true,
    logs: notificationLogsStore
  });
});

// POST /api/v1/notifications/send-test - Send test WhatsApp / SMS notification
notificationsRouter.post('/send-test', (req: Request, res: Response) => {
  const { channel, recipient, template, customParams } = req.body;

  if (!recipient) {
    return res.status(400).json({ error: 'Recipient phone number is required' });
  }

  const templatesMap: Record<string, string> = {
    order_created: `عزيزي العميل، تم استلام طلبك الجديد (#ORD-${Math.floor(1000 + Math.random() * 9000)}) بنجاح. شكراً لثقتك بمتجرنا! 🛍️`,
    payment_confirmed: `تم تأكيد دفع طلبك بنجاح! جاري الآن تجهيز الشحنة بعناية فائقة 💳✅`,
    order_shipped: `شحنتك في الطريق إليك الآن! رقم التتبع: SA-${Math.floor(10000000 + Math.random() * 90000000)} 🚚📦`,
    order_delivered: `تم توصيل طلبك بنجاح. نتمنى أن تنال المنتجات رضاك! شاركنا تقييمك ⭐⭐⭐⭐⭐`,
    cart_recovery: `مرحباً! لقد تركت منتجات رائعة في سلتك. استخدم كود (SAVE10) لإتمام طلبك الآن مع خصم 10% 🎁`
  };

  const messageBody = templatesMap[template] || `رسالة تجريبية من منصة CommerceOS: تم بنجاح اختبار قناة الإشعار ${channel}.`;

  const newLog: NotificationLog = {
    id: `ntf-${Date.now()}`,
    tenantId: 'tenant-royal-honey',
    channel: channel || 'whatsapp',
    recipient,
    recipientName: customParams?.name || 'عميل تجريبي',
    triggerEvent: template || 'order_created',
    templateName: `${template}_template`,
    messageBody,
    status: 'delivered',
    sentAt: new Date().toISOString(),
    provider: channel === 'whatsapp' ? 'whatsapp_cloud_api' : 'unifonic'
  };

  notificationLogsStore.unshift(newLog);

  res.json({
    success: true,
    message: `تم إرسال الإشعار التجريبي عبر ${channel === 'whatsapp' ? 'الواتساب (WhatsApp)' : 'الرسائل القصيرة (SMS)'} بنجاح!`,
    log: newLog
  });
});
