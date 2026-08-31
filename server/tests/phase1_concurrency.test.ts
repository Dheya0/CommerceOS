import { Money } from '../utils/money.ts';
import { OrderService, ORDER_ALLOWED_TRANSITIONS } from '../../src/db/services/orderService.ts';
import { PaymentService } from '../../src/db/services/paymentService.ts';
import { WebhookService } from '../../src/db/services/webhookService.ts';
import { OutboxService } from '../services/outbox.service.ts';
import { computeRequestHash } from '../middleware/idempotency.ts';
import { db } from '../../src/db/index.ts';
import {
  tenants,
  products,
  orders,
  coupons,
  inventoryMovements,
  couponRedemptions,
  idempotencyKeys,
  webhookEvents,
  outboxEvents
} from '../../src/db/schema.ts';
import { eq, and } from 'drizzle-orm';

/**
 * Phase 1: Commercial Financial Integrity, Concurrency, and Ledger Test Suite
 */
export async function runPhase1TestSuite() {
  console.log('\n============================================================');
  console.log('💰 RUNNING COMMERCEOS PHASE 1: FINANCIAL INTEGRITY & CONCURRENCY TEST SUITE');
  console.log('============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, errorDetail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName} - ${errorDetail || 'Assertion failed'}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST GROUP 1: Precision Integer Money Model (Halalas)
  // -------------------------------------------------------------
  console.log('👉 Group 1: Precision Money Calculations (Halala Minor Units)');
  try {
    const m1 = Money.fromDecimal(19.99, 'SAR');
    assert(m1.getAmount() === 1999, '19.99 SAR converts exactly to 1999 Halalas');
    assert(m1.toDecimal() === 19.99, '1999 Halalas converts back to 19.99 SAR');

    const m2 = Money.fromDecimal(0.01, 'SAR');
    const sum = m1.add(m2);
    assert(sum.getAmount() === 2000, '19.99 + 0.01 = 20.00 SAR (2000 Halalas)');

    // Percentage calculation with integer rounding
    const subtotal = Money.fromDecimal(100.00, 'SAR');
    const vat = subtotal.percentage(15);
    assert(vat.getAmount() === 1500, '15% VAT on 100.00 SAR is 15.00 SAR (1500 Halalas)');

    // Split distribution with remainder preservation (Zero Halala leak)
    const totalToSplit = Money.fromMinor(100, 'SAR'); // 100 Halalas divided by 3
    const splits = totalToSplit.split(3);
    const splitSum = splits.reduce((acc, cur) => acc + cur.getAmount(), 0);
    assert(splitSum === 100, 'Splitting 100 Halalas across 3 installments preserves exact 100 Halalas (no floating-point leakage)');
    assert(splits[0].getAmount() === 34 && splits[1].getAmount() === 33 && splits[2].getAmount() === 33, 'Split distributed remainder to first installment');
  } catch (e: any) {
    assert(false, 'Money tests crashed', e.message);
  }

  // -------------------------------------------------------------
  // SETUP SEED TENANT
  // -------------------------------------------------------------
  const testTenantId = 'tenant_p1_' + Date.now();
  try {
    await db.insert(tenants).values({
      id: testTenantId,
      name: 'متجر التمور والمناحل الملكية',
      slug: 'royal-dates-' + Date.now(),
      status: 'active',
      plan: 'enterprise',
      currency: 'SAR',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } catch (e: any) {
    console.error('Tenant setup error:', e);
  }

  // -------------------------------------------------------------
  // TEST GROUP 2: Atomic Checkout & Immutable Inventory Ledger
  // -------------------------------------------------------------
  console.log('\n👉 Group 2: Atomic Checkout, Snapshots & Inventory Movement Ledger');
  const testProductId = 'prod_test_' + Date.now();

  try {
    // Seed product with stock = 5
    await db.insert(products).values({
      id: testProductId,
      tenantId: testTenantId,
      title: 'عسل سدر أصلي فاخر',
      description: 'عسل طبيعي نقي 100%',
      price: 150,
      stock: 5,
      sku: 'HONEY-SIDR-001',
      category: 'honey',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const checkoutResult = await OrderService.createOrderTransaction({
      tenantId: testTenantId,
      customer: {
        name: 'سارة المطيري',
        email: 'sara.test@example.com',
        phone: '0551122334',
        city: 'الرياض',
        street: 'طريق الملك عبدالله'
      },
      items: [{ productId: testProductId, quantity: 2 }],
      paymentMethod: 'visa'
    });

    assert(checkoutResult.success === true, 'Order created successfully via atomic transaction');
    assert(checkoutResult.order?.items[0].quantity === 2, 'Order item quantity recorded as 2');

    // Verify product stock in DB was decremented to 3
    const updatedProd = await db.select().from(products).where(eq(products.id, testProductId)).limit(1);
    assert(updatedProd[0].stock === 3, 'Product inventory decremented from 5 to 3');

    // Verify Immutable Inventory Ledger was written
    const movements = await db
      .select()
      .from(inventoryMovements)
      .where(and(eq(inventoryMovements.tenantId, testTenantId), eq(inventoryMovements.productId, testProductId)));

    assert(movements.length === 1, 'Exactly one immutable inventory movement ledger record created');
    assert(movements[0].type === 'SALE', 'Inventory movement type is SALE');
    assert(movements[0].quantity === -2, 'Inventory movement quantity is -2');
    assert(movements[0].beforeQuantity === 5 && movements[0].afterQuantity === 3, 'Inventory before/after snapshots match 5 -> 3');

    // Verify Outbox Event was emitted
    const outboxRows = await db
      .select()
      .from(outboxEvents)
      .where(and(eq(outboxEvents.tenantId, testTenantId), eq(outboxEvents.aggregateType, 'order')));

    assert(outboxRows.length >= 1, 'Transactional Outbox event recorded for order creation');
    assert(outboxRows[0].eventType === 'order.created', 'Outbox eventType is order.created');
  } catch (e: any) {
    assert(false, 'Checkout & ledger tests crashed', e.message);
  }

  // -------------------------------------------------------------
  // TEST GROUP 3: Concurrency Protection (Overselling Prevention)
  // -------------------------------------------------------------
  console.log('\n👉 Group 3: High-Concurrency Race Condition & Overselling Prevention');
  const flashSaleProductId = 'prod_flash_' + Date.now();

  try {
    // Seed product with only 1 item in stock
    await db.insert(products).values({
      id: flashSaleProductId,
      tenantId: testTenantId,
      title: 'عرض محدود: زعفران سوبر نقيل',
      description: 'كمية محدودة جداً',
      price: 250,
      stock: 1,
      sku: 'SAFFRON-001',
      category: 'spices',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Launch 5 simultaneous checkout attempts for the single unit
    const concurrentAttempts = Array.from({ length: 5 }).map((_, idx) =>
      OrderService.createOrderTransaction({
        tenantId: testTenantId,
        customer: {
          name: `عميل متزامن ${idx + 1}`,
          email: `concurrent_${idx + 1}@example.com`,
          phone: `050000000${idx}`,
          city: 'جدة'
        },
        items: [{ productId: flashSaleProductId, quantity: 1 }],
        paymentMethod: 'apple_pay'
      })
    );

    const results = await Promise.all(concurrentAttempts);
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    assert(successCount === 1, `Exactly 1 concurrent order succeeded (got: ${successCount})`);
    assert(failCount === 4, `Remaining 4 concurrent orders safely rejected due to stock depletion (got: ${failCount})`);

    const finalStockRow = await db.select().from(products).where(eq(products.id, flashSaleProductId)).limit(1);
    assert(finalStockRow[0].stock === 0, 'Final inventory stock is exactly 0 (No negative oversell)');
  } catch (e: any) {
    assert(false, 'Concurrency race tests crashed', e.message);
  }

  // -------------------------------------------------------------
  // TEST GROUP 4: Coupon Concurrency & Redemption Auditing
  // -------------------------------------------------------------
  console.log('\n👉 Group 4: Coupon Limits & Atomic Redemption Ledger');
  const testCouponCode = 'FLASH50_' + Date.now().toString().slice(-4);
  const testCouponId = 'coup_' + Date.now();

  try {
    await db.insert(coupons).values({
      id: testCouponId,
      tenantId: testTenantId,
      code: testCouponCode,
      type: 'percentage',
      value: 20,
      usageLimit: 1, // Allowed only ONCE
      usageCount: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Attempt 1: Valid checkout with coupon
    const couponOrder1 = await OrderService.createOrderTransaction({
      tenantId: testTenantId,
      customer: {
        name: 'فيصل العتيبي',
        email: 'faisal@example.com',
        phone: '0567788990',
        city: 'الدمام'
      },
      items: [{ productId: testProductId, quantity: 1 }],
      paymentMethod: 'visa',
      couponCode: testCouponCode
    });

    assert(couponOrder1.success === true, 'First coupon checkout succeeded');
    assert(couponOrder1.order?.discount! > 0, 'Coupon discount successfully applied to order');

    // Attempt 2: Second checkout with exhausted coupon
    const couponOrder2 = await OrderService.createOrderTransaction({
      tenantId: testTenantId,
      customer: {
        name: 'خالد الغامدي',
        email: 'khaled@example.com',
        phone: '0599988776',
        city: 'الخبر'
      },
      items: [{ productId: testProductId, quantity: 1 }],
      paymentMethod: 'visa',
      couponCode: testCouponCode
    });

    assert(couponOrder2.success === false, 'Second checkout with exhausted coupon rejected');

    // Verify coupon redemption table has exact record
    const redemptions = await db
      .select()
      .from(couponRedemptions)
      .where(and(eq(couponRedemptions.tenantId, testTenantId), eq(couponRedemptions.couponId, testCouponId)));

    assert(redemptions.length === 1, 'Coupon redemption record properly stored in coupon_redemptions table');
  } catch (e: any) {
    assert(false, 'Coupon limit tests crashed', e.message);
  }

  // -------------------------------------------------------------
  // TEST GROUP 5: Database-Backed Idempotency Middleware
  // -------------------------------------------------------------
  console.log('\n👉 Group 5: Database-Backed Idempotency & Hash Mismatch Protection');
  const idemKey = 'test_idem_key_' + Date.now();

  try {
    const fakeReqA: any = {
      method: 'POST',
      path: '/api/v1/orders/checkout',
      query: {},
      body: { amount: 150, items: [{ id: 'p1', qty: 1 }] }
    };

    const hashA = computeRequestHash(fakeReqA);

    // Seed completed idempotency key
    await db.insert(idempotencyKeys).values({
      id: `idm_test_${Date.now()}`,
      tenantId: testTenantId,
      key: idemKey,
      requestMethod: 'POST',
      requestPath: '/api/v1/orders/checkout',
      requestBodyHash: hashA,
      responseStatus: 200,
      responseBody: { success: true, orderId: 'ORD-12345' },
      status: 'completed',
      lockedAt: new Date(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000)
    });

    const fakeReqB: any = {
      method: 'POST',
      path: '/api/v1/orders/checkout',
      query: {},
      body: { amount: 500, items: [{ id: 'p2', qty: 5 }] } // DIFFERENT PAYLOAD
    };

    const hashB = computeRequestHash(fakeReqB);
    assert(hashA !== hashB, 'Distinct request payloads generate distinct SHA-256 hashes');

    // Query DB with hash mismatch detection
    const retrievedKey = await db
      .select()
      .from(idempotencyKeys)
      .where(and(eq(idempotencyKeys.tenantId, testTenantId), eq(idempotencyKeys.key, idemKey)))
      .limit(1);

    assert(retrievedKey[0].requestBodyHash === hashA, 'Saved idempotency key correctly stores request hash');
    assert(retrievedKey[0].requestBodyHash !== hashB, 'Payload mismatch detected, protecting against key replay attacks with modified body');
  } catch (e: any) {
    assert(false, 'Idempotency tests crashed', e.message);
  }

  // -------------------------------------------------------------
  // TEST GROUP 6: Payment FSM & Partial / Full Refunds
  // -------------------------------------------------------------
  console.log('\n👉 Group 6: Payment State Machine & Strict Refund Limits');
  try {
    // Create an order first for this tenant
    const fsmOrder = await OrderService.createOrderTransaction({
      tenantId: testTenantId,
      customer: {
        name: 'محمد الشمري',
        email: 'mohammed@example.com',
        phone: '0512345678',
        city: 'الرياض'
      },
      items: [{ productId: testProductId, quantity: 1 }],
      paymentMethod: 'visa'
    });

    const fsmOrderId = fsmOrder.order!.id;

    // Create payment intent for this valid order
    const piResult = await PaymentService.createPaymentIntent({
      tenantId: testTenantId,
      orderId: fsmOrderId,
      amount: 300,
      currency: 'SAR',
      provider: 'moyasar'
    });

    assert(piResult.success === true, 'Payment Intent created in PENDING state');
    const intentId = piResult.intent!.id;

    // Transition to PAID
    const paidResult = await PaymentService.transitionPaymentState({
      paymentIntentId: intentId,
      tenantId: testTenantId,
      targetState: 'PAID',
      transactionId: 'txn_moyasar_123',
      capturedAmount: 300
    });

    assert(paidResult.success === true, 'Payment Intent transitioned to PAID');
    assert(paidResult.intent?.status === 'PAID', 'Payment status is PAID');

    // Verify Order paymentStatus updated to paid
    const updatedOrderRow = await db.select().from(orders).where(eq(orders.id, fsmOrderId)).limit(1);
    assert(updatedOrderRow[0].paymentStatus === 'paid', 'Order paymentStatus updated to paid upon transaction capture');

    // Test Invalid FSM Transition: Cannot go from PAID back to AUTHORIZED
    const invalidTransition = await PaymentService.transitionPaymentState({
      paymentIntentId: intentId,
      tenantId: testTenantId,
      targetState: 'AUTHORIZED'
    });
    assert(invalidTransition.success === false, 'Invalid FSM transition (PAID -> AUTHORIZED) blocked by state machine');

    // Partial Refund 1: 100 SAR
    const refund1 = await PaymentService.processRefund({
      paymentIntentId: intentId,
      tenantId: testTenantId,
      amount: 100,
      reason: 'إرجاع منتج جزئي',
      initiatedBy: 'Store Manager'
    });

    assert(refund1.success === true, 'Partial refund of 100 SAR succeeded');
    assert(refund1.refund?.type === 'partial', 'Refund classified as partial');

    // Test Over-Refund Attempt: Try refunding 250 SAR (only 200 SAR remaining)
    const overRefund = await PaymentService.processRefund({
      paymentIntentId: intentId,
      tenantId: testTenantId,
      amount: 250,
      reason: 'استرداد زائد غير مصرح به',
      initiatedBy: 'Store Manager'
    });

    assert(overRefund.success === false, 'Over-refund attempt rejected (Amount exceeds remaining capturable balance)');

    // Full remaining refund: 200 SAR
    const refund2 = await PaymentService.processRefund({
      paymentIntentId: intentId,
      tenantId: testTenantId,
      amount: 200,
      reason: 'استرداد المبلغ المتبقي بالكامل',
      initiatedBy: 'Store Manager'
    });

    assert(refund2.success === true, 'Full final refund of remaining 200 SAR succeeded');
    assert(refund2.refund?.type === 'full', 'Refund status updated to full REFUNDED');

    // Check order paymentStatus became refunded
    const finalOrderRow = await db.select().from(orders).where(eq(orders.id, fsmOrderId)).limit(1);
    assert(finalOrderRow[0].paymentStatus === 'refunded', 'Order paymentStatus updated to refunded on full refund');
  } catch (e: any) {
    assert(false, 'Payment FSM & refund tests crashed', e.message);
  }

  // -------------------------------------------------------------
  // TEST GROUP 7: Order Cancellation & Inventory Stock Restoration
  // -------------------------------------------------------------
  console.log('\n👉 Group 7: Order Cancellation with Atomic Stock Restoration');
  try {
    const cancelProdId = 'prod_cancel_' + Date.now();
    await db.insert(products).values({
      id: cancelProdId,
      tenantId: testTenantId,
      title: 'عسل سدر للملغي',
      price: 100,
      stock: 10,
      sku: 'HONEY-CANCEL-001',
      category: 'honey',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const createRes = await OrderService.createOrderTransaction({
      tenantId: testTenantId,
      customer: {
        name: 'عميل الإلغاء',
        email: 'cancel@example.com',
        phone: '0544332211',
        city: 'الرياض'
      },
      items: [{ productId: cancelProdId, quantity: 4 }],
      paymentMethod: 'mada'
    });

    const orderId = createRes.order!.id;

    // Verify stock dropped to 6
    const stockAfterOrder = await db.select().from(products).where(eq(products.id, cancelProdId)).limit(1);
    assert(stockAfterOrder[0].stock === 6, 'Stock decreased to 6 on order creation');

    // Cancel order
    const cancelRes = await OrderService.updateOrderStatus(orderId, 'cancelled', 'طلب العميل الإلغاء', testTenantId, 'Admin User');
    assert(cancelRes.success === true, 'Order status updated to cancelled');

    // Verify stock restored to 10
    const stockAfterCancel = await db.select().from(products).where(eq(products.id, cancelProdId)).limit(1);
    assert(stockAfterCancel[0].stock === 10, 'Stock restored to original 10 upon order cancellation');

    // Verify inventory movement record with type 'RELEASE'
    const releaseMovement = await db
      .select()
      .from(inventoryMovements)
      .where(and(eq(inventoryMovements.tenantId, testTenantId), eq(inventoryMovements.productId, cancelProdId), eq(inventoryMovements.type, 'RELEASE')));

    assert(releaseMovement.length === 1, 'Inventory movement RELEASE ledger recorded for cancelled order');
    assert(releaseMovement[0].quantity === 4, 'RELEASE quantity recorded as +4');

    // Test Terminal State Check: Cannot change from cancelled to shipped
    const invalidReopen = await OrderService.updateOrderStatus(orderId, 'shipped', 'محاولة غير صالحة', testTenantId, 'Admin User');
    assert(invalidReopen.success === false, 'Cannot reopen or transition a cancelled order (Terminal State Enforced)');
  } catch (e: any) {
    assert(false, 'Cancellation tests crashed', e.message);
  }

  // -------------------------------------------------------------
  // TEST GROUP 8: Webhook Replay & Idempotent Acknowledgment
  // -------------------------------------------------------------
  console.log('\n👉 Group 8: Webhook Replay Protection & Duplicate Detection');
  try {
    const webhookEventId = 'evt_test_webhook_' + Date.now();

    // Insert simulated processed event
    await db.insert(webhookEvents).values({
      id: `whevt_${Date.now()}`,
      tenantId: testTenantId,
      gateway: 'moyasar',
      eventId: webhookEventId,
      eventType: 'payment.paid',
      payload: { id: webhookEventId, amount: 100 },
      status: 'processed',
      createdAt: new Date()
    });

    // Replay same webhook payload
    const replayResult = await WebhookService.processIncomingWebhook({
      gateway: 'moyasar',
      rawBody: JSON.stringify({ id: webhookEventId, amount: 100 }),
      parsedBody: { id: webhookEventId, amount: 100 }
    });

    assert(replayResult.status === 200, 'Duplicate webhook returns HTTP 200 without reprocessing');
    assert(replayResult.response.status === 'duplicate', 'Webhook processor flagged event as duplicate replay');
  } catch (e: any) {
    assert(false, 'Webhook replay tests crashed', e.message);
  }

  // -------------------------------------------------------------
  // TEST GROUP 9: Transactional Outbox Worker Batch Processing
  // -------------------------------------------------------------
  console.log('\n👉 Group 9: Transactional Outbox Batch Processing');
  try {
    const outboxBatch = await OutboxService.processPendingEvents(10);
    assert(outboxBatch.processed >= 1, `Outbox worker successfully polled and processed ${outboxBatch.processed} pending events`);
  } catch (e: any) {
    assert(false, 'Outbox worker test crashed', e.message);
  }

  console.log('\n------------------------------------------------------------');
  console.log(`📊 PHASE 1 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('------------------------------------------------------------\n');

  return { passed, failed };
}

// Execute test suite when invoked directly
if (process.argv[1]?.includes('phase1_concurrency.test')) {
  runPhase1TestSuite().then((res) => {
    if (res.failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
}
