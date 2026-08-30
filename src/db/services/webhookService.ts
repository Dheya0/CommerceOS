import crypto from 'crypto';
import { db } from '../index.ts';
import {
  webhookEvents,
  orders,
  tenants,
  paymentIntents,
  auditLogs
} from '../schema.ts';
import { eq, and, desc } from 'drizzle-orm';
import { PaymentService } from './paymentService.ts';
import { WebhookLog, WebhookEventRecord } from '../../types.ts';

export interface ProcessWebhookParams {
  gateway: string;
  signatureHeader?: string;
  rawBody: string;
  parsedBody: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface WebhookVerificationResult {
  verified: boolean;
  error?: string;
  computedSignature?: string;
}

export class WebhookService {
  /**
   * Cryptographic HMAC-SHA256 signature verifier with constant-time equality check.
   * STRICT: No demo secret fallback, no test_sig_* bypass.
   */
  static verifySignature(params: {
    rawBody: string;
    signatureHeader?: string;
    secret: string;
    gateway: string;
  }): WebhookVerificationResult {
    const { rawBody, signatureHeader, secret } = params;

    if (!secret || secret.trim() === '' || secret === 'test_secret_demo') {
      return {
        verified: false,
        error: 'مفتاح توقيع Webhook غير مهيأ (Unconfigured Gateway Secret)'
      };
    }

    if (!signatureHeader || signatureHeader.trim() === '') {
      return {
        verified: false,
        error: 'ترويسة التوقيع الرقمي مفقودة (Missing Signature Header)'
      };
    }

    try {
      const cleanHeader = signatureHeader
        .replace(/^(sha256=|t=\d+,v1=|v1=)/i, '')
        .trim();

      const computedHex = crypto
        .createHmac('sha256', secret)
        .update(rawBody, 'utf8')
        .digest('hex');

      const hmacBuf = Buffer.from(computedHex, 'utf8');
      const headerBuf = Buffer.from(cleanHeader, 'utf8');

      if (hmacBuf.length !== headerBuf.length) {
        return {
          verified: false,
          error: 'فشل التحقق الرقمي: طول التوقيع غير متطابق',
          computedSignature: computedHex
        };
      }

      const isValid = crypto.timingSafeEqual(hmacBuf, headerBuf);
      return {
        verified: isValid,
        error: isValid ? undefined : 'فشل التحقق الأمني: التوقيع الرقمي HMAC غير متطابق',
        computedSignature: computedHex
      };
    } catch (err: any) {
      return {
        verified: false,
        error: `خطأ أثناء احتساب التوقيع الرقمي: ${err.message}`
      };
    }
  }

  /**
   * Hardened Webhook Processor
   * Enforces Replay Protection, Tenant Validation, Order Ownership, Amount Integrity, and FSM Transitions.
   */
  static async processIncomingWebhook(params: ProcessWebhookParams): Promise<{
    status: number;
    response: {
      received: boolean;
      status: string;
      eventId?: string;
      orderId?: string;
      paymentIntentId?: string;
      error?: string;
      warning?: string;
    };
  }> {
    const startTime = Date.now();
    const { gateway, signatureHeader, rawBody, parsedBody, ipAddress } = params;

    // 1. Extract Event ID & Type
    const eventId = String(
      parsedBody?.id ||
      parsedBody?.event_id ||
      parsedBody?.data?.id ||
      parsedBody?.payment_id ||
      parsedBody?.transaction_id ||
      `evt_${Date.now()}`
    );

    const eventType = String(
      parsedBody?.event ||
      parsedBody?.type ||
      parsedBody?.event_type ||
      'payment.captured'
    );

    // Extract Order & Tenant Metadata
    const orderId = parsedBody?.order_id ||
      parsedBody?.data?.order_id ||
      parsedBody?.metadata?.order_id ||
      parsedBody?.data?.metadata?.order_id;

    const payloadTenantId = parsedBody?.tenant_id ||
      parsedBody?.metadata?.tenant_id ||
      parsedBody?.data?.metadata?.tenant_id;

    const transactionId = parsedBody?.transaction_id ||
      parsedBody?.payment_id ||
      parsedBody?.data?.id ||
      parsedBody?.id;

    // 2. Replay Protection: Check if eventId has already been recorded in PostgreSQL
    const existingEvents = await db
      .select()
      .from(webhookEvents)
      .where(and(eq(webhookEvents.gateway, gateway), eq(webhookEvents.eventId, eventId)))
      .limit(1);

    if (existingEvents.length > 0) {
      const existing = existingEvents[0];
      const processingTime = Date.now() - startTime;

      return {
        status: 200,
        response: {
          received: true,
          status: 'duplicate',
          eventId,
          orderId: existing.orderId || undefined,
          warning: 'Event already processed and recorded. Idempotent acknowledgment returned.'
        }
      };
    }

    // 3. Resolve Tenant & Gateway Secret
    let targetTenantId = payloadTenantId;
    let orderRow: any = null;

    if (orderId) {
      const ordRows = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);

      if (ordRows.length > 0) {
        orderRow = ordRows[0];
        if (!targetTenantId) {
          targetTenantId = orderRow.tenantId;
        } else if (targetTenantId !== orderRow.tenantId) {
          // Tenant Mismatch - Security Alert
          await db.insert(webhookEvents).values({
            id: `whevt_${Date.now()}`,
            tenantId: targetTenantId || 'unknown',
            gateway,
            eventId,
            eventType,
            signature: signatureHeader || null,
            payload: parsedBody,
            status: 'rejected',
            orderId,
            errorMessage: 'Security Breach: Tenant mismatch between payload and order record',
            processingTimeMs: Date.now() - startTime
          });

          return {
            status: 403,
            response: {
              received: false,
              status: 'rejected',
              error: 'Tenant mismatch: Order does not belong to the declared tenant'
            }
          };
        }
      }
    }

    if (!targetTenantId) {
      targetTenantId = 'tenant_default';
    }

    // Lookup secret from tenant settings or gateway-specific environment variables
    const tenantRows = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, targetTenantId))
      .limit(1);

    const tenantSettings: any = tenantRows[0]?.settings || {};
    const configuredGatewaySecret =
      tenantSettings?.paymentGateways?.[gateway]?.webhookSecret ||
      process.env[`${gateway.toUpperCase()}_WEBHOOK_SECRET`] ||
      process.env.WEBHOOK_SIGNING_SECRET;

    // 4. HMAC Signature Verification
    const verification = WebhookService.verifySignature({
      rawBody: rawBody || JSON.stringify(parsedBody),
      signatureHeader,
      secret: configuredGatewaySecret || '',
      gateway
    });

    if (!verification.verified) {
      await db.insert(webhookEvents).values({
        id: `whevt_${Date.now()}`,
        tenantId: targetTenantId,
        gateway,
        eventId,
        eventType,
        signature: signatureHeader || null,
        payload: parsedBody,
        status: 'rejected',
        orderId: orderId || null,
        errorMessage: verification.error,
        processingTimeMs: Date.now() - startTime
      });

      return {
        status: 401,
        response: {
          received: false,
          status: 'rejected',
          error: verification.error
        }
      };
    }

    // 5. Financial Validation (Amount & Currency Integrity)
    const payloadAmount = Number(
      parsedBody?.amount ||
      parsedBody?.data?.amount ||
      parsedBody?.captured_amount ||
      parsedBody?.data?.captured_amount ||
      0
    );

    const payloadCurrency = String(
      parsedBody?.currency ||
      parsedBody?.data?.currency ||
      'SAR'
    ).toUpperCase();

    let matchedIntent: any = null;

    if (orderId && orderRow) {
      // Find corresponding PaymentIntent
      const intentRows = await db
        .select()
        .from(paymentIntents)
        .where(
          and(
            eq(paymentIntents.orderId, orderId),
            eq(paymentIntents.tenantId, targetTenantId)
          )
        )
        .orderBy(desc(paymentIntents.createdAt))
        .limit(1);

      if (intentRows.length > 0) {
        matchedIntent = intentRows[0];
      }

      // Check currency
      if (payloadCurrency !== (orderRow.currency || 'SAR')) {
        const errorMsg = `عدم تطابق العملة: العملة في الإشعار (${payloadCurrency}) لا تطابق عملة الطلب (${orderRow.currency || 'SAR'})`;
        await db.insert(webhookEvents).values({
          id: `whevt_${Date.now()}`,
          tenantId: targetTenantId,
          gateway,
          eventId,
          eventType,
          signature: signatureHeader || null,
          payload: parsedBody,
          status: 'failed',
          orderId,
          paymentIntentId: matchedIntent?.id || null,
          transactionId,
          amount: payloadAmount,
          currency: payloadCurrency,
          errorMessage: errorMsg,
          processingTimeMs: Date.now() - startTime
        });

        return {
          status: 422,
          response: {
            received: true,
            status: 'failed',
            error: errorMsg
          }
        };
      }

      // Check amount: Must match expected order total (protecting against payment undercutting)
      if (payloadAmount > 0 && orderRow.total > 0 && payloadAmount < orderRow.total) {
        const errorMsg = `احتيال محتمل في المبلغ: المبلغ المدفوع (${payloadAmount}) أقل من إجمالي الطلب المطلوب (${orderRow.total})`;
        await db.insert(webhookEvents).values({
          id: `whevt_${Date.now()}`,
          tenantId: targetTenantId,
          gateway,
          eventId,
          eventType,
          signature: signatureHeader || null,
          payload: parsedBody,
          status: 'failed',
          orderId,
          paymentIntentId: matchedIntent?.id || null,
          transactionId,
          amount: payloadAmount,
          currency: payloadCurrency,
          errorMessage: errorMsg,
          processingTimeMs: Date.now() - startTime
        });

        // Flag order audit log
        await db.insert(auditLogs).values({
          id: `log_fraud_${Date.now()}`,
          tenantId: targetTenantId,
          action: 'FRAUD_SUSPECTED_AMOUNT_MISMATCH',
          performedBy: `Webhook (${gateway})`,
          details: {
            orderId,
            expectedTotal: orderRow.total,
            receivedAmount: payloadAmount,
            eventId
          },
          createdAt: new Date()
        });

        return {
          status: 422,
          response: {
            received: true,
            status: 'failed',
            error: errorMsg
          }
        };
      }
    }

    // 6. Transition State Machine based on Gateway Event Type
    let targetPaymentState: 'PAID' | 'AUTHORIZED' | 'FAILED' | 'REFUNDED' | null = null;
    const lowerEventType = eventType.toLowerCase();

    if (
      lowerEventType.includes('paid') ||
      lowerEventType.includes('captured') ||
      lowerEventType.includes('approved') ||
      lowerEventType.includes('charge.succeeded') ||
      lowerEventType.includes('payment_completed')
    ) {
      targetPaymentState = 'PAID';
    } else if (
      lowerEventType.includes('authorized') ||
      lowerEventType.includes('hold')
    ) {
      targetPaymentState = 'AUTHORIZED';
    } else if (
      lowerEventType.includes('failed') ||
      lowerEventType.includes('declined') ||
      lowerEventType.includes('charge.failed')
    ) {
      targetPaymentState = 'FAILED';
    } else if (
      lowerEventType.includes('refund')
    ) {
      targetPaymentState = 'REFUNDED';
    }

    if (targetPaymentState && matchedIntent) {
      const transitionResult = await PaymentService.transitionPaymentState({
        paymentIntentId: matchedIntent.id,
        tenantId: targetTenantId,
        targetState: targetPaymentState,
        transactionId,
        capturedAmount: payloadAmount || matchedIntent.amount,
        provider: gateway,
        gatewayResponse: parsedBody,
        operatorName: `Gateway Webhook (${gateway.toUpperCase()})`,
        ipAddress
      });

      if (!transitionResult.success) {
        console.warn('[WebhookService] Transition warning:', transitionResult.error);
      }
    } else if (orderId && orderRow && targetPaymentState === 'PAID') {
      // If no intent existed, update order payment status safely
      await db
        .update(orders)
        .set({
          paymentStatus: 'paid',
          updatedAt: new Date()
        })
        .where(eq(orders.id, orderId));
    }

    // 7. Persist Webhook Event in PostgreSQL
    const eventRecordId = `whevt_${Date.now()}`;
    await db.insert(webhookEvents).values({
      id: eventRecordId,
      tenantId: targetTenantId,
      gateway,
      eventId,
      eventType,
      signature: signatureHeader || null,
      payload: parsedBody,
      status: 'processed',
      orderId: orderId || null,
      paymentIntentId: matchedIntent?.id || null,
      transactionId,
      amount: payloadAmount || null,
      currency: payloadCurrency,
      processingTimeMs: Date.now() - startTime
    });

    return {
      status: 200,
      response: {
        received: true,
        status: 'processed',
        eventId,
        orderId,
        paymentIntentId: matchedIntent?.id
      }
    };
  }

  /**
   * Retrieves persistent webhook events from PostgreSQL for audit log dashboard
   */
  static async getWebhookLogs(tenantId?: string, limit = 50): Promise<WebhookLog[]> {
    let rows;
    if (tenantId) {
      rows = await db
        .select()
        .from(webhookEvents)
        .where(eq(webhookEvents.tenantId, tenantId))
        .orderBy(desc(webhookEvents.createdAt))
        .limit(limit);
    } else {
      rows = await db
        .select()
        .from(webhookEvents)
        .orderBy(desc(webhookEvents.createdAt))
        .limit(limit);
    }

    return rows.map((r) => ({
      id: r.id,
      gateway: r.gateway as any,
      eventId: r.eventId,
      eventType: r.eventType,
      signature: r.signature || 'verified',
      verified: r.status === 'processed' || r.status === 'verified',
      timestamp: r.createdAt.toISOString(),
      payload: r.payload,
      orderId: r.orderId || undefined,
      status: r.status === 'rejected' ? 'rejected' : r.status === 'duplicate' ? 'replay_detected' : r.status === 'failed' ? 'failed' : 'processed',
      processingTimeMs: r.processingTimeMs || 10,
      errorMessage: r.errorMessage || undefined
    }));
  }
}
