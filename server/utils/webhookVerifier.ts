import crypto from 'crypto';
import { WebhookLog } from '../../src/types.ts';
import { WebhookService } from '../../src/db/services/webhookService.ts';

// In-Memory Replay Prevention Cache as immediate fast-path buffer before DB query
class WebhookReplayStore {
  private processedEvents: Map<string, number> = new Map();
  private readonly TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  isDuplicate(eventId: string): boolean {
    const recordedAt = this.processedEvents.get(eventId);
    if (!recordedAt) return false;
    
    if (Date.now() - recordedAt > this.TTL_MS) {
      this.processedEvents.delete(eventId);
      return false;
    }
    return true;
  }

  record(eventId: string): void {
    this.processedEvents.set(eventId, Date.now());
  }

  cleanup(): void {
    const now = Date.now();
    for (const [id, timestamp] of this.processedEvents.entries()) {
      if (now - timestamp > this.TTL_MS) {
        this.processedEvents.delete(id);
      }
    }
  }
}

export const webhookReplayStore = new WebhookReplayStore();

// Fallback in-memory audit logs buffer for fast retrieval
export const webhookAuditLogs: WebhookLog[] = [];

/**
 * Verifies HMAC SHA256 Signature for incoming payment webhooks.
 * ZERO-TRUST: Absolutely NO test_secret or test_sig_* bypasses.
 */
export function verifyWebhookSignature(params: {
  rawBody: string | object;
  signatureHeader?: string;
  secret: string;
  gateway: 'tamara' | 'tabby' | 'moyasar' | 'tap' | 'hyperpay' | 'stripe' | 'custom' | string;
}): { verified: boolean; error?: string; computedSignature?: string } {
  const { rawBody, signatureHeader, secret, gateway } = params;
  const rawString = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);

  return WebhookService.verifySignature({
    rawBody: rawString,
    signatureHeader,
    secret,
    gateway
  });
}
