import { Router, Request, Response } from 'express';
import { NotificationLog } from '../../src/types';

export const notificationsRouter = Router();

const notificationLogsStore: NotificationLog[] = [];

// GET /api/v1/notifications/logs - List notification dispatch logs
notificationsRouter.get('/logs', (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId || req.tenantId || '';
  const logs = tenantId ? notificationLogsStore.filter(l => l.tenantId === tenantId) : notificationLogsStore;
  res.json({
    success: true,
    logs
  });
});

// POST /api/v1/notifications/send-test - Send test WhatsApp / SMS notification
notificationsRouter.post('/send-test', (req: Request, res: Response) => {
  const { channel, recipient, template, customParams } = req.body;
  const tenantId = req.user?.tenantId || req.tenantId || '';

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
    tenantId,
    channel: channel || 'whatsapp',
    recipient,
    recipientName: customParams?.name || 'عميل المتجر',
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
