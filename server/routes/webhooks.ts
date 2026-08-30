import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { WebhookService } from '../../src/db/services/webhookService.ts';
import { db } from '../db.ts';

export const webhooksRouter = Router();

// GET /api/v1/webhooks/logs - Get persistent webhook audit trail from PostgreSQL
webhooksRouter.get('/logs', async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId || req.query.tenantId as string | undefined;
  try {
    const logs = await WebhookService.getWebhookLogs(tenantId);
    res.json({
      success: true,
      logs
    });
  } catch (err: any) {
    console.error('[Webhooks] Failed to fetch logs:', err);
    res.status(500).json({ success: false, error: 'فشل استرجاع سجلات الإشعارات' });
  }
});

// POST /api/v1/webhooks/simulate - HMAC Signature Calculator & Simulator tool for Merchant Admin
webhooksRouter.post('/simulate', async (req: Request, res: Response) => {
  const { gateway, secret, payload, eventType, orderId, amount } = req.body;

  if (!secret) {
    return res.status(400).json({ error: 'السر التشفيري (Secret) مطلوب لمحاكاة التوقيع' });
  }

  const payloadObj = payload || {
    id: `evt_sim_${Date.now()}`,
    event: eventType || 'payment.captured',
    order_id: orderId || 'ord-101',
    amount: amount || 540,
    currency: 'SAR',
    created_at: new Date().toISOString()
  };

  const rawString = JSON.stringify(payloadObj);
  const calculatedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawString, 'utf8')
    .digest('hex');

  res.json({
    success: true,
    gateway: gateway || 'moyasar',
    calculatedSignature: `sha256=${calculatedSignature}`,
    rawBody: rawString,
    payload: payloadObj,
    sampleCurl: `curl -X POST http://localhost:3000/api/v1/webhooks/${gateway || 'moyasar'} \\
  -H "Content-Type: application/json" \\
  -H "X-Signature: sha256=${calculatedSignature}" \\
  -d '${rawString}'`
  });
});

// POST /api/v1/webhooks/:gateway - Unified webhook receiver with HMAC signature verification & DB Replay Protection
webhooksRouter.post('/:gateway', async (req: Request, res: Response) => {
  const { gateway } = req.params;
  const signatureHeader = (
    req.headers['x-signature'] ||
    req.headers['x-tamara-signature'] ||
    req.headers['x-tabby-signature'] ||
    req.headers['x-moyasar-signature'] ||
    req.headers['x-tap-signature'] ||
    req.headers['x-hyperpay-signature']
  ) as string | undefined;

  const rawBody = (req as any).rawBody || JSON.stringify(req.body);

  try {
    const result = await WebhookService.processIncomingWebhook({
      gateway,
      signatureHeader,
      rawBody,
      parsedBody: req.body,
      ipAddress: req.ip
    });

    // Sync in-memory store if order was updated
    if (result.response?.orderId && result.status === 200 && result.response.status === 'processed') {
      db.updateOrderPaymentStatus(
        result.response.orderId,
        'paid',
        `تم تأكيد الدفع التلقائي عبر Webhook بوابة ${gateway.toUpperCase()} برقم معاملة موثق`,
        undefined,
        `Webhook: ${gateway}`
      );
    }

    return res.status(result.status).json(result.response);
  } catch (err: any) {
    console.error(`[Webhook:${gateway}] Internal Error:`, err);
    return res.status(500).json({
      received: false,
      status: 'failed',
      error: 'فشل معالجة إشعار بوابة الدفع داخلياً'
    });
  }
});
