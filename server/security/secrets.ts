import crypto from 'crypto';
import { configService } from '../infrastructure/config.ts';

export class SecretsManager {
  private static instance: SecretsManager;
  private readonly secrets: Map<string, string> = new Map();

  private constructor() {
    this.hydrateEnvironmentSecrets();
  }

  public static getInstance(): SecretsManager {
    if (!SecretsManager.instance) {
      SecretsManager.instance = new SecretsManager();
    }
    return SecretsManager.instance;
  }

  private hydrateEnvironmentSecrets(): void {
    if (process.env.JWT_SECRET) this.secrets.set('JWT_SECRET', process.env.JWT_SECRET);
    if (process.env.DATABASE_URL) this.secrets.set('DATABASE_URL', process.env.DATABASE_URL);
    if (process.env.GEMINI_API_KEY) this.secrets.set('GEMINI_API_KEY', process.env.GEMINI_API_KEY);
  }

  public getSecret(key: string): string | undefined {
    return this.secrets.get(key) || process.env[key];
  }

  public getMaskedSecret(key: string): string {
    const val = this.getSecret(key);
    if (!val) return '[NOT_SET]';
    if (val.length <= 6) return '******';
    return `${val.substring(0, 3)}...${val.substring(val.length - 3)}`;
  }

  public constantTimeCompare(a: string, b: string): boolean {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  }
}

export const secretsManager = SecretsManager.getInstance();
