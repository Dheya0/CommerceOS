import crypto from 'crypto';
import { db } from '../index.ts';
import {
  paymentIntents,
  paymentAttempts,
  refunds,
  orders,
  auditLogs,
  tenants
} from '../schema.ts';
import { eq, and, desc, sql } from 'drizzle-orm';
import {
  PaymentIntent,
  PaymentIntentStatus,
  PaymentAttempt,
  Refund,
  Order
} from '../../types.ts';

export interface CreatePaymentIntentParams {
  tenantId: string;
  orderId: string;
  amount: number;
  currency?: string;
  provider: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
  expiresInMinutes?: number;
}

export interface TransitionPaymentStateParams {
  paymentIntentId: string;
  tenantId: string;
  targetState: PaymentIntentStatus;
  transactionId?: string;
  capturedAmount?: number;
  provider?: string;
  paymentMethod?: string;
  gatewayResponse?: any;
  failureReason?: string;
  operatorName?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ProcessRefundParams {
  paymentIntentId: string;
  tenantId: string;
  amount: number;
  reason: string;
  initiatedBy: string;
  gatewayRefundId?: string;
  gatewayResponse?: any;
}

// Finite State Machine allowed state transitions
const ALLOWED_TRANSITIONS: Record<PaymentIntentStatus, PaymentIntentStatus[]> = {
  PENDING: ['AUTHORIZED', 'PAID', 'FAILED', 'CANCELLED'],
  AUTHORIZED: ['PAID', 'FAILED', 'CANCELLED'],
  PAID: ['REFUNDED', 'PARTIALLY_REFUNDED'],
  PARTIALLY_REFUNDED: ['PARTIALLY_REFUNDED', 'REFUNDED'],
  FAILED: [],
  CANCELLED: [],
  REFUNDED: []
};

export class PaymentService {
  /**
   * Creates a new authoritative Payment Intent in PENDING state
   */
  static async createPaymentIntent(params: CreatePaymentIntentParams): Promise<{
    success: boolean;
    intent?: PaymentIntent;
    error?: string;
  }> {
    const {
      tenantId,
      orderId,
      amount,
      currency = 'SAR',
      provider,
      paymentMethod,
      metadata = {},
      expiresInMinutes = 30
    } = params;

    if (amount <= 0) {
      return { success: false, error: 'مبلغ الدفع غير صالح (يجب أن يكون أكبر من صفر)' };
    }

    const intentId = `pi_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const clientSecret = `sec_${crypto.randomBytes(24).toString('hex')}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresInMinutes * 60 * 1000);

    try {
      return await db.transaction(async (tx) => {
        // Verify order exists and belongs to tenant
        const orderRows = await tx
          .select()
          .from(orders)
          .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)))
          .limit(1);

        if (orderRows.length === 0) {
          throw new Error('الطلب غير موجود أو لا ينتمي لهذا المتجر');
        }

        const newIntent = {
          id: intentId,
          tenantId,
          orderId,
          amount,
          currency: currency.toUpperCase(),
          provider,
          paymentMethod: paymentMethod || provider,
          status: 'PENDING' as PaymentIntentStatus,
          clientSecret,
          capturedAmount: 0,
          refundedAmount: 0,
          metadata,
          expiresAt,
          createdAt: now,
          updatedAt: now
        };

        await tx.insert(paymentIntents).values(newIntent);

        await tx.insert(auditLogs).values({
          id: `log_pi_${intentId}`,
          tenantId,
          action: 'PAYMENT_INTENT_CREATED',
          performedBy: 'Checkout Engine',
          details: {
            paymentIntentId: intentId,
            orderId,
            amount,
            currency,
            provider
          },
          createdAt: now
        });

        return {
          success: true,
          intent: {
            ...newIntent,
            expiresAt: expiresAt.toISOString(),
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
          }
        };
      });
    } catch (err: any) {
      console.error('[PaymentService.createPaymentIntent] Error:', err);
      return { success: false, error: err.message || 'فشل إنشاء عملية الدفع' };
    }
  }

  /**
   * Deterministic State Machine Transition with Row Locking & Zero-Trust Audit Trail
   */
  static async transitionPaymentState(params: TransitionPaymentStateParams): Promise<{
    success: boolean;
    intent?: PaymentIntent;
    order?: Order;
    error?: string;
  }> {
    const {
      paymentIntentId,
      tenantId,
      targetState,
      transactionId,
      capturedAmount,
      provider,
      paymentMethod,
      gatewayResponse,
      failureReason,
      operatorName = 'Gateway Webhook / Financial Engine',
      ipAddress,
      userAgent
    } = params;

    try {
      return await db.transaction(async (tx) => {
        // 1. Lock payment intent row (FOR UPDATE)
        const lockedIntents = await tx
          .select()
          .from(paymentIntents)
          .where(
            and(
              eq(paymentIntents.id, paymentIntentId),
              eq(paymentIntents.tenantId, tenantId)
            )
          )
          .for('update')
          .limit(1);

        if (lockedIntents.length === 0) {
          throw new Error(`معاملة الدفع غير موجودة (${paymentIntentId})`);
        }

        const currentIntent = lockedIntents[0];
        const currentState = currentIntent.status as PaymentIntentStatus;

        // 2. Validate FSM State Transition
        if (currentState !== targetState) {
          const allowed = ALLOWED_TRANSITIONS[currentState] || [];
          if (!allowed.includes(targetState)) {
            throw new Error(
              `انتقال حالة الدفع غير مسموح به مالياً: لا يمكن الانتقال من ${currentState} إلى ${targetState}`
            );
          }
        }

        const now = new Date();
        const finalCaptured = targetState === 'PAID'
          ? (capturedAmount ?? currentIntent.amount)
          : currentIntent.capturedAmount;

        // 3. Update Payment Intent
        await tx
          .update(paymentIntents)
          .set({
            status: targetState,
            capturedAmount: finalCaptured,
            updatedAt: now
          })
          .where(eq(paymentIntents.id, paymentIntentId));

        // 4. Record Payment Attempt / Transaction
        const attemptId = `txn_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
        await tx.insert(paymentAttempts).values({
          id: attemptId,
          paymentIntentId,
          tenantId,
          orderId: currentIntent.orderId,
          transactionId: transactionId || null,
          provider: provider || currentIntent.provider,
          method: paymentMethod || currentIntent.paymentMethod || currentIntent.provider,
          amount: currentIntent.amount,
          currency: currentIntent.currency,
          status: targetState === 'PAID' ? 'CAPTURED' : (targetState as any),
          gatewayResponse: gatewayResponse || null,
          failureReason: failureReason || null,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          createdAt: now
        });

        // 5. Update Order Payment Status atomically
        let orderPaymentStatus: 'paid' | 'pending' | 'failed' | 'pending_verification' = 'pending';
        let orderTimelineNote = '';

        if (targetState === 'PAID') {
          orderPaymentStatus = 'paid';
          orderTimelineNote = `تم تأكيد الدفع بنجاح عبر بوابة ${provider || currentIntent.provider} (رقم المعاملة: ${transactionId || attemptId})`;
        } else if (targetState === 'AUTHORIZED') {
          orderPaymentStatus = 'pending';
          orderTimelineNote = `تم حجز المبلغ بنجاح وموافقة البنك (Authorized)`;
        } else if (targetState === 'FAILED') {
          orderPaymentStatus = 'failed';
          orderTimelineNote = `فشلت عملية الدفع: ${failureReason || 'رفض من بوابة الدفع'}`;
        } else if (targetState === 'CANCELLED') {
          orderPaymentStatus = 'failed';
          orderTimelineNote = 'تم إلغاء عملية الدفع من قبل العميل أو لانتهاء المهلة';
        }

        // Lock order row
        const lockedOrders = await tx
          .select()
          .from(orders)
          .where(eq(orders.id, currentIntent.orderId))
          .for('update')
          .limit(1);

        if (lockedOrders.length > 0) {
          const ord = lockedOrders[0];
          await tx
            .update(orders)
            .set({
              paymentStatus: orderPaymentStatus,
              updatedAt: now
            })
            .where(eq(orders.id, ord.id));
        }

        // 6. Transactional Audit Log
        await tx.insert(auditLogs).values({
          id: `log_state_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          tenantId,
          action: 'PAYMENT_STATE_TRANSITION',
          performedBy: operatorName,
          details: {
            paymentIntentId,
            orderId: currentIntent.orderId,
            from: currentState,
            to: targetState,
            transactionId,
            capturedAmount: finalCaptured
          },
          createdAt: now
        });

        const updatedIntent: PaymentIntent = {
          id: currentIntent.id,
          tenantId: currentIntent.tenantId,
          orderId: currentIntent.orderId,
          amount: currentIntent.amount,
          currency: currentIntent.currency,
          provider: currentIntent.provider as any,
          status: targetState,
          clientSecret: currentIntent.clientSecret,
          capturedAmount: finalCaptured,
          refundedAmount: currentIntent.refundedAmount,
          paymentMethod: currentIntent.paymentMethod || undefined,
          metadata: currentIntent.metadata as any,
          expiresAt: currentIntent.expiresAt ? currentIntent.expiresAt.toISOString() : undefined,
          createdAt: currentIntent.createdAt.toISOString(),
          updatedAt: now.toISOString()
        };

        return {
          success: true,
          intent: updatedIntent
        };
      });
    } catch (err: any) {
      console.error('[PaymentService.transitionPaymentState] Failed:', err);
      return {
        success: false,
        error: err.message || 'فشل تحديث حالة الدفع'
      };
    }
  }

  /**
   * Executes Full or Partial Refund with balance checks & immutable audit logs
   */
  static async processRefund(params: ProcessRefundParams): Promise<{
    success: boolean;
    refund?: Refund;
    intent?: PaymentIntent;
    error?: string;
  }> {
    const {
      paymentIntentId,
      tenantId,
      amount,
      reason,
      initiatedBy,
      gatewayRefundId,
      gatewayResponse
    } = params;

    if (amount <= 0) {
      return { success: false, error: 'مبلغ الاسترداد غير صالح' };
    }

    try {
      return await db.transaction(async (tx) => {
        const lockedIntents = await tx
          .select()
          .from(paymentIntents)
          .where(
            and(
              eq(paymentIntents.id, paymentIntentId),
              eq(paymentIntents.tenantId, tenantId)
            )
          )
          .for('update')
          .limit(1);

        if (lockedIntents.length === 0) {
          throw new Error('عملية الدفع غير موجودة');
        }

        const intent = lockedIntents[0];
        if (intent.status !== 'PAID' && intent.status !== 'PARTIALLY_REFUNDED') {
          throw new Error('لا يمكن استرداد مبالغ لعملية دفع لم تكتمل أو غير مدفوعة');
        }

        const maxRefundable = intent.capturedAmount - intent.refundedAmount;
        if (amount > maxRefundable) {
          throw new Error(
            `مبلغ الاسترداد (${amount} ر.س) يتجاوز الرصيد القابل للاسترداد المتبقي (${maxRefundable} ر.س)`
          );
        }

        const newRefundedTotal = intent.refundedAmount + amount;
        const isFullRefund = newRefundedTotal >= intent.capturedAmount;
        const newStatus: PaymentIntentStatus = isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
        const now = new Date();

        const refundId = `ref_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

        // Insert refund record
        const newRefundRecord = {
          id: refundId,
          paymentIntentId,
          orderId: intent.orderId,
          tenantId,
          transactionId: gatewayRefundId || null,
          gatewayRefundId: gatewayRefundId || null,
          amount,
          currency: intent.currency,
          reason,
          type: isFullRefund ? 'full' : 'partial',
          status: 'SUCCEEDED' as const,
          initiatedBy,
          gatewayResponse: gatewayResponse || null,
          createdAt: now,
          updatedAt: now
        };

        await tx.insert(refunds).values(newRefundRecord);

        // Update payment intent
        await tx
          .update(paymentIntents)
          .set({
            refundedAmount: newRefundedTotal,
            status: newStatus,
            updatedAt: now
          })
          .where(eq(paymentIntents.id, paymentIntentId));

        // Audit log
        await tx.insert(auditLogs).values({
          id: `log_ref_${refundId}`,
          tenantId,
          action: isFullRefund ? 'PAYMENT_FULL_REFUND' : 'PAYMENT_PARTIAL_REFUND',
          performedBy: initiatedBy,
          details: {
            paymentIntentId,
            orderId: intent.orderId,
            refundId,
            refundAmount: amount,
            newRefundedTotal,
            reason
          },
          createdAt: now
        });

        const refundObj: Refund = {
          id: refundId,
          paymentIntentId,
          orderId: intent.orderId,
          tenantId,
          transactionId: gatewayRefundId,
          gatewayRefundId,
          amount,
          currency: intent.currency,
          reason,
          type: isFullRefund ? 'full' : 'partial',
          status: 'SUCCEEDED',
          initiatedBy,
          gatewayResponse,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        };

        return {
          success: true,
          refund: refundObj
        };
      });
    } catch (err: any) {
      console.error('[PaymentService.processRefund] Error:', err);
      return { success: false, error: err.message || 'فشلت معالجة الاسترداد المالي' };
    }
  }

  /**
   * Retrieves intent details with attempts and refunds
   */
  static async getPaymentIntent(intentId: string, tenantId: string) {
    const intents = await db
      .select()
      .from(paymentIntents)
      .where(
        and(
          eq(paymentIntents.id, intentId),
          eq(paymentIntents.tenantId, tenantId)
        )
      )
      .limit(1);

    if (intents.length === 0) return null;

    const intent = intents[0];
    const attempts = await db
      .select()
      .from(paymentAttempts)
      .where(eq(paymentAttempts.paymentIntentId, intentId))
      .orderBy(desc(paymentAttempts.createdAt));

    const refundList = await db
      .select()
      .from(refunds)
      .where(eq(refunds.paymentIntentId, intentId))
      .orderBy(desc(refunds.createdAt));

    return {
      ...intent,
      attempts,
      refunds: refundList
    };
  }

  /**
   * Retrieves all payment transactions for a tenant
   */
  static async listTenantTransactions(tenantId: string, limit = 50) {
    return await db
      .select()
      .from(paymentAttempts)
      .where(eq(paymentAttempts.tenantId, tenantId))
      .orderBy(desc(paymentAttempts.createdAt))
      .limit(limit);
  }
}
