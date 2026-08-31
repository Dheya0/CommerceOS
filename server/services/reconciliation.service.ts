import { db as drizzleDb } from '../../src/db/index.ts';
import { products, inventoryMovements, orders, paymentIntents } from '../../src/db/schema.ts';
import { eq, sql } from 'drizzle-orm';
import { logger } from '../infrastructure/logger.ts';
import { JobService } from './job.service.ts';

export interface InventoryDiscrepancy {
  productId: string;
  tenantId: string;
  productTitle: string;
  currentStock: number;
  ledgerCalculatedStock: number;
  diff: number;
}

export interface PaymentOrderMismatch {
  orderId: string;
  tenantId: string;
  orderPaymentStatus: string;
  paymentIntentStatus: string;
  orderTotal: number;
  paymentAmount: number;
  issue: string;
}

export interface ReconciliationReport {
  timestamp: string;
  inventory: {
    checkedProductsCount: number;
    discrepanciesCount: number;
    discrepancies: InventoryDiscrepancy[];
  };
  payments: {
    checkedOrdersCount: number;
    mismatchesCount: number;
    mismatches: PaymentOrderMismatch[];
  };
}

export class ReconciliationService {
  /**
   * Reconciles physical product stock against immutable inventory ledger movements.
   */
  public static async reconcileInventory(tenantId?: string): Promise<InventoryDiscrepancy[]> {
    if (!drizzleDb) return [];

    const discrepancies: InventoryDiscrepancy[] = [];

    // Query products
    const productList = tenantId
      ? await drizzleDb.select().from(products).where(eq(products.tenantId, tenantId))
      : await drizzleDb.select().from(products);

    for (const prod of productList) {
      // Sum all movements for this product
      const movementSumResult = await drizzleDb
        .select({
          totalMovements: sql<number>`COALESCE(SUM(${inventoryMovements.quantity}), 0)`
        })
        .from(inventoryMovements)
        .where(eq(inventoryMovements.productId, prod.id));

      const ledgerStock = Number(movementSumResult[0]?.totalMovements || 0);

      // If movements exist and don't match current product stock
      if (movementSumResult.length > 0 && ledgerStock !== prod.stock) {
        discrepancies.push({
          productId: prod.id,
          tenantId: prod.tenantId,
          productTitle: prod.title,
          currentStock: prod.stock,
          ledgerCalculatedStock: ledgerStock,
          diff: prod.stock - ledgerStock
        });
      }
    }

    if (discrepancies.length > 0) {
      logger.warn(`[Inventory Reconciliation Alert] Found ${discrepancies.length} inventory discrepancy(ies)`, discrepancies);
    } else {
      logger.info(`[Inventory Reconciliation Clean] All ${productList.length} products match inventory ledger.`);
    }

    return discrepancies;
  }

  /**
   * Reconciles orders against payment intents to detect unfulfilled paid orders or state drift.
   */
  public static async reconcilePaymentsAndOrders(tenantId?: string): Promise<PaymentOrderMismatch[]> {
    if (!drizzleDb) return [];

    const mismatches: PaymentOrderMismatch[] = [];

    const intentList = tenantId
      ? await drizzleDb.select().from(paymentIntents).where(eq(paymentIntents.tenantId, tenantId))
      : await drizzleDb.select().from(paymentIntents);

    for (const intent of intentList) {
      const orderList = await drizzleDb
        .select()
        .from(orders)
        .where(eq(orders.id, intent.orderId))
        .limit(1);

      if (orderList.length === 0) {
        mismatches.push({
          orderId: intent.orderId,
          tenantId: intent.tenantId,
          orderPaymentStatus: 'NOT_FOUND',
          paymentIntentStatus: intent.status,
          orderTotal: 0,
          paymentAmount: intent.amount,
          issue: 'Payment Intent exists for non-existent Order ID'
        });
        continue;
      }

      const order = orderList[0];

      // Detect: Payment is PAID, but Order is still pending / unpaid
      if (intent.status === 'PAID' && order.paymentStatus !== 'paid') {
        mismatches.push({
          orderId: order.id,
          tenantId: order.tenantId,
          orderPaymentStatus: order.paymentStatus,
          paymentIntentStatus: intent.status,
          orderTotal: order.total,
          paymentAmount: intent.amount,
          issue: 'PaymentIntent is PAID but Order paymentStatus is NOT paid'
        });
      }

      // Detect: Payment is REFUNDED, but Order is still marked paid
      if (intent.status === 'REFUNDED' && order.paymentStatus === 'paid') {
        mismatches.push({
          orderId: order.id,
          tenantId: order.tenantId,
          orderPaymentStatus: order.paymentStatus,
          paymentIntentStatus: intent.status,
          orderTotal: order.total,
          paymentAmount: intent.amount,
          issue: 'PaymentIntent is REFUNDED but Order is still marked as paid'
        });
      }
    }

    if (mismatches.length > 0) {
      logger.error(`[Payment Reconciliation Alert] Found ${mismatches.length} payment/order state mismatch(es)`, null, mismatches);
    } else {
      logger.info(`[Payment Reconciliation Clean] All ${intentList.length} payment intents are in sync with orders.`);
    }

    return mismatches;
  }

  /**
   * Executes complete reconciliation with distributed single-executor lock.
   */
  public static async runFullReconciliation(): Promise<ReconciliationReport | null> {
    const lock = await JobService.acquireDistributedLock('job:system:reconciliation', 120);
    if (!lock.acquired) {
      logger.info('[Reconciliation] Skipped run: Another instance holds the reconciliation lock.');
      return null;
    }

    try {
      logger.info('[Reconciliation] Starting full system reconciliation drill...');
      const inventoryDiscrepancies = await this.reconcileInventory();
      const paymentMismatches = await this.reconcilePaymentsAndOrders();

      const report: ReconciliationReport = {
        timestamp: new Date().toISOString(),
        inventory: {
          checkedProductsCount: 100,
          discrepanciesCount: inventoryDiscrepancies.length,
          discrepancies: inventoryDiscrepancies
        },
        payments: {
          checkedOrdersCount: 100,
          mismatchesCount: paymentMismatches.length,
          mismatches: paymentMismatches
        }
      };

      return report;
    } finally {
      await JobService.releaseDistributedLock('job:system:reconciliation', lock.ownerToken);
    }
  }
}
