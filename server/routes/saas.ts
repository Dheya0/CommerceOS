import { Router, Request, Response } from 'express';
import { saasBillingService, SAAS_PLANS } from '../services/saasBilling.service.ts';
import { requireStoreOwner, requirePermission } from '../middleware/auth.ts';
import { logger } from '../infrastructure/logger.ts';

function createSuccessResponse<T>(res: Response, data: T, statusCode: number = 200) {
  return res.status(statusCode).json({ success: true, data });
}

function createErrorResponse(res: Response, message: string, statusCode: number = 400, details?: any) {
  return res.status(statusCode).json({ success: false, error: message, message, details });
}

export const saasRouter = Router();

// -------------------------------------------------------------
// 1. Plans & Entitlements Catalog
// -------------------------------------------------------------
saasRouter.get('/plans', (_req: Request, res: Response) => {
  return createSuccessResponse(res, {
    plans: Object.values(SAAS_PLANS),
    catalogVersion: '2026.1',
    currency: 'SAR',
    vatRate: 0.15,
    annualDiscountPercent: 20
  });
});

// -------------------------------------------------------------
// 2. Subscription & Tenant Entitlements
// -------------------------------------------------------------
saasRouter.get('/subscription', (req: Request, res: Response) => {
  const tenantId = req.tenantId || req.query.tenantId as string;
  if (!tenantId) {
    return createErrorResponse(res, 'Tenant context required', 400);
  }

  const subscription = saasBillingService.getSubscription(tenantId);
  const planId = subscription?.planId || (req.tenant?.plan as any) || 'starter';
  const plan = SAAS_PLANS[planId as keyof typeof SAAS_PLANS] || SAAS_PLANS.starter;
  const customer = saasBillingService.getBillingCustomer(tenantId);
  const usage = saasBillingService.getTenantUsage(tenantId);

  return createSuccessResponse(res, {
    subscription: subscription || {
      id: `sub-${tenantId}`,
      tenantId,
      planId,
      billingCycle: 'monthly',
      status: req.tenant?.status === 'trial' ? 'trialing' : 'active',
      currentPeriodStart: req.tenant?.createdAt || new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString()
    },
    plan,
    customer,
    usage,
    entitlements: plan.entitlements
  });
});

saasRouter.post('/subscription/upgrade', requirePermission('settings'), (req: Request, res: Response) => {
  const tenantId = req.tenantId;
  const { planId, billingCycle } = req.body;

  if (!planId || !SAAS_PLANS[planId as keyof typeof SAAS_PLANS]) {
    return createErrorResponse(res, 'خطة الاشتراك المطلوبة غير صالحة', 400);
  }

  try {
    const actor = req.user?.name || 'Store Admin';
    const result = saasBillingService.upgradePlan(tenantId, planId, billingCycle || 'monthly', actor);
    return createSuccessResponse(res, {
      message: 'تمت ترقية باقة المتجر بنجاح وتفعيل كافة الميزات والمحددات فورياً.',
      ...result
    });
  } catch (err: any) {
    return createErrorResponse(res, err.message, 400);
  }
});

saasRouter.post('/subscription/downgrade', requirePermission('settings'), (req: Request, res: Response) => {
  const tenantId = req.tenantId;
  const { planId } = req.body;

  if (!planId || !SAAS_PLANS[planId as keyof typeof SAAS_PLANS]) {
    return createErrorResponse(res, 'الخطة المختارة غير صالحة', 400);
  }

  try {
    const actor = req.user?.name || 'Store Admin';
    const result = saasBillingService.downgradePlan(tenantId, planId, actor);
    return createSuccessResponse(res, {
      message: 'تم تعديل باقة المتجر بنجاح مع الاحتفاظ بكافة بياناتك السابقة بأمان.',
      ...result
    });
  } catch (err: any) {
    return createErrorResponse(res, err.message, 400);
  }
});

saasRouter.post('/subscription/cancel', requireStoreOwner, (req: Request, res: Response) => {
  const tenantId = req.tenantId;
  const { reason } = req.body;

  try {
    const actor = req.user?.name || 'Store Owner';
    const sub = saasBillingService.cancelSubscription(tenantId, reason, actor);
    return createSuccessResponse(res, {
      message: 'تم إلغاء التجديد التلقائي. ستبقى الميزات متاحة حتى نهاية الفترة الحالية.',
      subscription: sub
    });
  } catch (err: any) {
    return createErrorResponse(res, err.message, 400);
  }
});

saasRouter.post('/subscription/reactivate', requirePermission('settings'), (req: Request, res: Response) => {
  const tenantId = req.tenantId;

  try {
    const actor = req.user?.name || 'Store Admin';
    const sub = saasBillingService.reactivateSubscription(tenantId, actor);
    return createSuccessResponse(res, {
      message: 'تمت إعادة تفعيل الاشتراك بنجاح.',
      subscription: sub
    });
  } catch (err: any) {
    return createErrorResponse(res, err.message, 400);
  }
});

// -------------------------------------------------------------
// 3. Usage & Quotas
// -------------------------------------------------------------
saasRouter.get('/usage', (req: Request, res: Response) => {
  const tenantId = req.tenantId || req.query.tenantId as string;
  if (!tenantId) return createErrorResponse(res, 'Tenant context required', 400);

  const usage = saasBillingService.getTenantUsage(tenantId);
  return createSuccessResponse(res, { usage });
});

// -------------------------------------------------------------
// 4. Invoices & Billing History
// -------------------------------------------------------------
saasRouter.get('/invoices', (req: Request, res: Response) => {
  const tenantId = req.tenantId || req.query.tenantId as string;
  const invoices = saasBillingService.getInvoices(tenantId);
  return createSuccessResponse(res, { invoices });
});

saasRouter.get('/invoices/:id', (req: Request, res: Response) => {
  const invoice = saasBillingService.getInvoiceById(req.params.id);
  if (!invoice) return createErrorResponse(res, 'الفاتورة غير موجودة', 404);
  return createSuccessResponse(res, { invoice });
});

saasRouter.post('/invoices/:id/pay', (req: Request, res: Response) => {
  try {
    const invoice = saasBillingService.payInvoice(req.params.id);
    return createSuccessResponse(res, {
      message: 'تم سداد الفاتورة بنجاح وتحديث حالة الحساب إلى الوضع النشط.',
      invoice
    });
  } catch (err: any) {
    return createErrorResponse(res, err.message, 400);
  }
});

// -------------------------------------------------------------
// 5. Billing Customer Profile
// -------------------------------------------------------------
saasRouter.get('/customer', (req: Request, res: Response) => {
  const tenantId = req.tenantId;
  const customer = saasBillingService.getBillingCustomer(tenantId);
  return createSuccessResponse(res, { customer });
});

saasRouter.put('/customer', requirePermission('settings'), (req: Request, res: Response) => {
  const tenantId = req.tenantId;
  const updated = saasBillingService.updateBillingCustomer(tenantId, req.body);
  return createSuccessResponse(res, {
    message: 'تم تحديث البيانات الضريبية والمالية بنجاح.',
    customer: updated
  });
});

// -------------------------------------------------------------
// 6. Custom Domains Subsystem
// -------------------------------------------------------------
saasRouter.get('/domains', (req: Request, res: Response) => {
  const tenantId = req.tenantId;
  const domains = saasBillingService.getDomains(tenantId);
  return createSuccessResponse(res, { domains });
});

saasRouter.post('/domains', requirePermission('settings'), (req: Request, res: Response) => {
  const tenantId = req.tenantId;
  const { hostname } = req.body;

  if (!hostname) return createErrorResponse(res, 'اسم النطاق مطلوب', 400);

  try {
    const domain = saasBillingService.addCustomDomain(tenantId, hostname);
    return createSuccessResponse(res, {
      message: 'تمت إضافة النطاق بنجاح. يرجى توجيه سجلات DNS إلى خوادم CommerceOS.',
      domain
    });
  } catch (err: any) {
    return createErrorResponse(res, err.message, 400);
  }
});

saasRouter.post('/domains/:id/verify', requirePermission('settings'), (req: Request, res: Response) => {
  try {
    const verified = saasBillingService.verifyDomain(req.params.id);
    return createSuccessResponse(res, {
      message: 'تم التحقق من سجلات DNS وتوليد شهادة SSL المجانية بنجاح!',
      domain: verified
    });
  } catch (err: any) {
    return createErrorResponse(res, err.message, 400);
  }
});

saasRouter.post('/domains/:id/primary', requirePermission('settings'), (req: Request, res: Response) => {
  const tenantId = req.tenantId;
  try {
    const domain = saasBillingService.setPrimaryDomain(tenantId, req.params.id);
    return createSuccessResponse(res, {
      message: 'تم تعيين النطاق كنطاق رئيسي للمتجر بنجاح.',
      domain
    });
  } catch (err: any) {
    return createErrorResponse(res, err.message, 400);
  }
});

saasRouter.delete('/domains/:id', requirePermission('settings'), (req: Request, res: Response) => {
  const tenantId = req.tenantId;
  const success = saasBillingService.deleteDomain(tenantId, req.params.id);
  if (!success) return createErrorResponse(res, 'النطاق غير موجود', 404);
  return createSuccessResponse(res, { message: 'تم حذف النطاق بنجاح.' });
});

// -------------------------------------------------------------
// 7. API Keys & Webhooks Subsystem
// -------------------------------------------------------------
saasRouter.get('/api-keys', requirePermission('settings'), (req: Request, res: Response) => {
  const tenantId = req.tenantId;
  const keys = saasBillingService.getApiKeys(tenantId);
  return createSuccessResponse(res, { apiKeys: keys });
});

saasRouter.post('/api-keys', requirePermission('settings'), (req: Request, res: Response) => {
  const tenantId = req.tenantId;
  const { name, scopes } = req.body;

  if (!name) return createErrorResponse(res, 'اسم المفتاح مطلوب', 400);

  try {
    const result = saasBillingService.createApiKey(tenantId, name, scopes || []);
    return createSuccessResponse(res, {
      message: 'تم إنشاء المفتاح بنجاح. يرجى حفظ المفتاح السري الآن فلن يتم عرضه مرة أخرى لأسباب أمنية.',
      apiKey: result.apiKey,
      rawSecretKey: result.rawSecretKey
    });
  } catch (err: any) {
    return createErrorResponse(res, err.message, 400);
  }
});

saasRouter.delete('/api-keys/:id', requirePermission('settings'), (req: Request, res: Response) => {
  const tenantId = req.tenantId;
  const success = saasBillingService.revokeApiKey(tenantId, req.params.id);
  if (!success) return createErrorResponse(res, 'المفتاح غير موجود', 404);
  return createSuccessResponse(res, { message: 'تم إبطال المفتاح بنجاح.' });
});

saasRouter.get('/webhooks', requirePermission('settings'), (req: Request, res: Response) => {
  const tenantId = req.tenantId;
  const webhooks = saasBillingService.getMerchantWebhooks(tenantId);
  const deliveries = saasBillingService.getWebhookDeliveries(tenantId);
  return createSuccessResponse(res, { webhooks, deliveries });
});

saasRouter.post('/webhooks', requirePermission('settings'), (req: Request, res: Response) => {
  const tenantId = req.tenantId;
  const { name, url, events } = req.body;

  if (!name || !url) return createErrorResponse(res, 'الاسم ورابط الـ URL مطلوبان', 400);

  try {
    const webhook = saasBillingService.createMerchantWebhook(tenantId, name, url, events || []);
    return createSuccessResponse(res, {
      message: 'تم تسجيل خطاف الويب بنجاح مع توقيع HMAC-SHA256 آمن.',
      webhook
    });
  } catch (err: any) {
    return createErrorResponse(res, err.message, 400);
  }
});

saasRouter.post('/webhooks/:id/test', requirePermission('settings'), (req: Request, res: Response) => {
  const tenantId = req.tenantId;
  const deliveries = saasBillingService.dispatchMerchantWebhook(tenantId, 'test.ping', {
    message: 'CommerceOS Webhook Test Event',
    timestamp: new Date().toISOString(),
    tenantId
  });

  return createSuccessResponse(res, {
    message: 'تم إرسال حدث اختباري وتوقيعه بنجاح.',
    deliveries
  });
});

saasRouter.post('/webhooks/deliveries/:id/retry', requirePermission('settings'), (req: Request, res: Response) => {
  try {
    const retried = saasBillingService.retryWebhookDelivery(req.params.id);
    return createSuccessResponse(res, {
      message: 'تمت إعادة الإرسال بنجاح.',
      delivery: retried
    });
  } catch (err: any) {
    return createErrorResponse(res, err.message, 400);
  }
});

// -------------------------------------------------------------
// 8. Inbound Billing Webhook (Moyasar / Stripe)
// -------------------------------------------------------------
saasRouter.post('/webhooks/billing-inbound', (req: Request, res: Response) => {
  const eventId = req.headers['x-event-id'] as string || `evt_${Date.now()}`;
  const eventType = req.body.type || 'invoice.paid';

  const result = saasBillingService.handleInboundBillingWebhook(eventId, eventType, req.body);
  return res.json(result);
});

// -------------------------------------------------------------
// 9. Platform Admin HQ Endpoints
// -------------------------------------------------------------
saasRouter.get('/admin/analytics', (_req: Request, res: Response) => {
  const metrics = saasBillingService.getPlatformBillingAnalytics();
  return createSuccessResponse(res, { metrics });
});

saasRouter.get('/admin/audit-logs', (_req: Request, res: Response) => {
  const logs = saasBillingService.getBillingAuditLogs();
  return createSuccessResponse(res, { logs });
});

saasRouter.post('/admin/override', (req: Request, res: Response) => {
  const { tenantId, overrideType, value, reason } = req.body;
  const actor = req.user?.name || 'SuperAdmin';

  if (!tenantId || !overrideType || !reason) {
    return createErrorResponse(res, 'البيانات غير مكتملة (المتجر، نوع التعديل، والسبب إلزامي).', 400);
  }

  try {
    saasBillingService.adminManualOverride(tenantId, overrideType, value, actor, reason);
    return createSuccessResponse(res, {
      message: 'تم التعديل الإداري اليدوي وتسجيله في سجل التدقيق بنجاح.'
    });
  } catch (err: any) {
    return createErrorResponse(res, err.message, 400);
  }
});
