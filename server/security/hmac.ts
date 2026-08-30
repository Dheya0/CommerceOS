import crypto from 'crypto';
import { secretsManager } from './secrets.ts';

export class HmacSecurity {
  public static calculateHmacSha256(payload: string | Buffer, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  }

  public static verifyHmacSha256(
    rawBody: string | Buffer,
    receivedSignature: string,
    secret: string
  ): boolean {
    if (!rawBody || !receivedSignature || !secret) {
      return false;
    }
    const cleanReceived = receivedSignature.replace(/^sha256=/, '').trim();
    const calculated = this.calculateHmacSha256(rawBody, secret);
    return secretsManager.constantTimeCompare(cleanReceived, calculated);
  }
}
