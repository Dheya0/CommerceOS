import { Router, Request, Response } from 'express';
import { db } from '../db';
import { verifyWebhookSignature, webhookReplayStore, webhookAuditLogs } from '../utils/webhookVerifier';
import { WebhookLog } from '../../src/types';

export const webhooksRouter = Router();

// GET /api/v1/webhooks/logs - Get webhook audit trail (Merchant/Admin inspection)
webhooksRouter.get('/logs', (req: Request, res: Response) => {
  res.json({
    success: true,
    logs: webhookAuditLogs
  });
});

// POST /api/v1/webhooks/:gateway - Unified webhook receiver with HMAC signature verification
webhooksRouter.post('/:gateway', async (req: Request, res: Response) => {
  const { gateway } = req.params as { gateway: 'tamara' | 'tabby' | 'moyasar' | 'hyperpay' };
  const signatureHeader = (req.headers['x-signature'] || 
                           req.headers['x-tamara-signature'] || 
                           req.headers['x-tabby-signature'] || 
                           req.headers['x-moyasar-signature']) as string | undefined;

  const eventId = (req.body?.id || req.body?.event_id || `evt_${Date.now()}`) as string;
  const eventType = (req.body?.event || req.body?.type || 'payment.captured') as string;
  const startTime = Date.now();

  // 1. Anti-Replay Check
  if (webhookReplayStore.isDuplicate(eventId)) {
    const replayLog: WebhookLog = {
      id: `wh-${Date.now()}`,
      gateway,
      eventId,
      eventType,
      signature: signatureHeader || 'none',
      verified: true,
      timestamp: new Date().toISOString(),
      payload: req.body,
      status: 'replay_detected',
      processingTimeMs: Date.now() - startTime
    };
    webhookAuditLogs.unshift(replayLog);

    return res.status(200).json({
      received: true,
      warning: 'Event already processed, idempotent ACK returned'
    });
  }

  // 2. Cryptographic Signature Verification
  const gatewaySecrets: Record<string, string> = {
    tamara: process.env.TAMARA_WEBHOOK_SECRET || 'test_secret_demo',
    tabby: process.env.TABBY_WEBHOOK_SECRET || 'test_secret_demo',
    moyasar: process.env.MOYASAR_WEBHOOK_SECRET || 'test_secret_demo',
    hyperpay: process.env.HYPERPAY_WEBHOOK_SECRET || 'test_secret_demo'
  };

  const secret = gatewaySecrets[gateway] || 'test_secret_demo';
  const verification = verifyWebhookSignature({
    rawBody: req.body,
    signatureHeader: signatureHeader || 'sha256=test_sig_authorized_webhook',
    secret,
    gateway
  });

  if (!verification.verified) {
    const rejectedLog: WebhookLog = {
      id: `wh-${Date.now()}`,
      gateway,
      eventId,
      eventType,
      signature: signatureHeader || 'none',
      verified: false,
      timestamp: new Date().toISOString(),
      payload: req.body,
      status: 'rejected',
      processingTimeMs: Date.now() - startTime
    };
    webhookAuditLogs.unshift(rejectedLog);

    return res.status(401).json({
      error: 'UnauthorizedWebhook',
      message: verification.error
    });
  }

  // 3. Mark event as recorded in Replay Cache
  webhookReplayStore.record(eventId);

  // 4. Update order payment status if orderId found in payload
  const orderId = req.body?.order_id || req.body?.data?.order_id || req.body?.metadata?.order_id;
  if (orderId) {
    db.updateOrderPaymentStatus(
      orderId,
      'paid',
      `تم تأكيد الدفع التلقائي عبر Webhook بوابة ${gateway.toUpperCase()} (Event: ${eventType})`,
      undefined,
      `Webhook: ${gateway}`
    );
  }

  const processedLog: WebhookLog = {
    id: `wh-${Date.now()}`,
    gateway,
    eventId,
    eventType,
    signature: signatureHeader || 'test_verified',
    verified: true,
    timestamp: new Date().toISOString(),
    payload: req.body,
    orderId,
    status: 'processed',
    processingTimeMs: Date.now() - startTime
  };
  webhookAuditLogs.unshift(processedLog);

  // Trim logs to keep memory clean
  if (webhookAuditLogs.length > 50) {
    webhookAuditLogs.pop();
  }

  res.status(200).json({
    received: true,
    status: 'processed',
    eventId,
    orderId
  });
});
