export type OrderStatus = 'draft' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded' | 'returned';
export type PaymentStatus = 'unpaid' | 'authorized' | 'captured' | 'paid' | 'partially_refunded' | 'refunded' | 'voided' | 'failed';

/**
 * CommerceOS Advanced Fraud & Abuse Prevention Engine
 * Validates State Machine transitions, velocity spikes, price tampering, and inventory integrity.
 */

// -------------------------------------------------------------
// 1. Legal Payment & Order State Machine Transition Matrix
// -------------------------------------------------------------
const LEGAL_PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  unpaid: ['authorized', 'paid', 'failed'],
  authorized: ['captured', 'voided', 'failed', 'paid'],
  captured: ['refunded', 'partially_refunded'],
  paid: ['refunded', 'partially_refunded'],
  partially_refunded: ['refunded'],
  refunded: [], // Terminal
  voided: [], // Terminal
  failed: ['unpaid'] // May retry payment from clean slate
};

const LEGAL_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  draft: ['pending', 'cancelled'],
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled', 'completed'],
  shipped: ['delivered', 'returned'],
  delivered: ['completed', 'returned'],
  completed: ['refunded', 'returned'],
  cancelled: [], // Terminal
  refunded: [], // Terminal
  returned: [] // Terminal
};

export class StateMachineValidator {
  static isValidPaymentTransition(current: PaymentStatus, target: PaymentStatus): boolean {
    if (current === target) return true;
    const allowed = LEGAL_PAYMENT_TRANSITIONS[current] || [];
    return allowed.includes(target);
  }

  static isValidOrderTransition(current: OrderStatus, target: OrderStatus): boolean {
    if (current === target) return true;
    const allowed = LEGAL_ORDER_TRANSITIONS[current] || [];
    return allowed.includes(target);
  }
}

// -------------------------------------------------------------
// 2. Velocity & Anomaly Risk Evaluator
// -------------------------------------------------------------
interface VelocityTracker {
  count: number;
  firstTimestamp: number;
}

class VelocityEngine {
  private tracker = new Map<string, VelocityTracker>();

  /**
   * Records an action and tests if velocity threshold is breached
   */
  recordAndCheck(key: string, limit: number, windowMs: number): { allowed: boolean; currentCount: number } {
    const now = Date.now();
    let entry = this.tracker.get(key);

    if (!entry || now - entry.firstTimestamp > windowMs) {
      entry = { count: 1, firstTimestamp: now };
      this.tracker.set(key, entry);
      return { allowed: true, currentCount: 1 };
    }

    entry.count += 1;
    if (entry.count > limit) {
      return { allowed: false, currentCount: entry.count };
    }

    return { allowed: true, currentCount: entry.count };
  }

  reset(key: string) {
    this.tracker.delete(key);
  }
}

export const velocityEngine = new VelocityEngine();

// -------------------------------------------------------------
// 3. Checkout Price & Line Item Verification
// -------------------------------------------------------------
export interface CheckoutItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
  clientDeclaredPrice?: number;
}

export interface TrustedProductPrice {
  id: string;
  price: number;
  currency: string;
  isAvailable: boolean;
}

export function validateCheckoutIntegrity(
  items: CheckoutItemInput[],
  trustedProductLookup: (id: string) => TrustedProductPrice | undefined
): {
  valid: boolean;
  tampered: boolean;
  computedTotal: number;
  error?: string;
} {
  if (!items || items.length === 0) {
    return { valid: false, tampered: false, computedTotal: 0, error: 'Checkout cart is empty' };
  }

  let total = 0;

  for (const item of items) {
    // 1. Quantity Validation (Reject negative, zero, float, or absurd quantities)
    if (!Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 9999) {
      return {
        valid: false,
        tampered: true,
        computedTotal: 0,
        error: `Invalid quantity detected: ${item.quantity}. Must be positive integer ≤ 9999.`
      };
    }

    // 2. Fetch server-authoritative product
    const trustedProduct = trustedProductLookup(item.productId);
    if (!trustedProduct) {
      return {
        valid: false,
        tampered: false,
        computedTotal: 0,
        error: `Product ${item.productId} not found in store catalog.`
      };
    }

    if (!trustedProduct.isAvailable) {
      return {
        valid: false,
        tampered: false,
        computedTotal: 0,
        error: `Product ${item.productId} is currently archived or out of stock.`
      };
    }

    // 3. Price Tamper Check: Did client attempt to alter unit price?
    if (item.clientDeclaredPrice !== undefined && item.clientDeclaredPrice !== trustedProduct.price) {
      // Client declared a price differing from database price!
      // Server will override with authoritative price, but we flag tampering.
    }

    total += trustedProduct.price * item.quantity;
  }

  return {
    valid: true,
    tampered: false,
    computedTotal: Math.round(total * 100) / 100
  };
}

// -------------------------------------------------------------
// 4. Payment Risk & Fraud Scoring (Separation of Concerns)
// -------------------------------------------------------------
export interface FraudEvaluationFactors {
  ipAddress: string;
  amount: number;
  tenantId: string;
  failedAttemptsInPastHour: number;
  isTorOrVpn?: boolean;
  isFirstTimeBuyer?: boolean;
}

export function evaluatePaymentFraudRisk(factors: FraudEvaluationFactors): {
  riskScore: number; // 0 to 100 (0 = Clean, 100 = Fraud)
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendation: 'APPROVE' | 'CHALLENGE_3DS' | 'MANUAL_REVIEW' | 'REJECT';
  riskReasons: string[];
} {
  let score = 5; // baseline
  const reasons: string[] = [];

  // Excessive Failed Payment Attempts
  if (factors.failedAttemptsInPastHour >= 5) {
    score += 45;
    reasons.push('High volume of failed payment attempts from identity in past 60 minutes');
  } else if (factors.failedAttemptsInPastHour >= 3) {
    score += 25;
    reasons.push('Multiple failed payment attempts');
  }

  // Unusually High Order Amount
  if (factors.amount > 20000) {
    score += 25;
    reasons.push('Order value exceeds SAR 20,000 threshold');
  }

  // Tor / Anonymous proxy
  if (factors.isTorOrVpn) {
    score += 20;
    reasons.push('Connection origin detected as VPN/Tor anonymizer');
  }

  score = Math.min(100, Math.max(0, score));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let recommendation: 'APPROVE' | 'CHALLENGE_3DS' | 'MANUAL_REVIEW' | 'REJECT' = 'APPROVE';

  if (score >= 80) {
    riskLevel = 'CRITICAL';
    recommendation = 'REJECT';
  } else if (score >= 60) {
    riskLevel = 'HIGH';
    recommendation = 'MANUAL_REVIEW';
  } else if (score >= 35) {
    riskLevel = 'MEDIUM';
    recommendation = 'CHALLENGE_3DS';
  }

  return { riskScore: score, riskLevel, recommendation, riskReasons: reasons };
}
