import dotenv from 'dotenv';
dotenv.config();

export interface ServerConfig {
  env: 'development' | 'production' | 'test';
  port: number;
  host: string;
  jwtSecret: string;
  databaseUrl?: string;
  platformName: string;
  corsOrigins: string[];
  enableDetailedLogging: boolean;
  rateLimit: {
    windowMs: number;
    maxCheckoutRequests: number;
    maxApiRequests: number;
  };
  security: {
    hmacToleranceSeconds: number;
    requireHttpsInProd: boolean;
  };
}

class ConfigService {
  private static instance: ConfigService;
  private readonly config: Readonly<ServerConfig>;

  private constructor() {
    this.validateEnvironment();
    this.config = Object.freeze(this.loadConfig());
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public get<K extends keyof ServerConfig>(key: K): ServerConfig[K] {
    return this.config[key];
  }

  public getAll(): Readonly<ServerConfig> {
    return this.config;
  }

  private validateEnvironment(): void {
    const requiredEnvVars: string[] = [];
    const missing = requiredEnvVars.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.error(`[FATAL] Missing required environment variables: ${missing.join(', ')}`);
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  private loadConfig(): ServerConfig {
    const env = (process.env.NODE_ENV === 'production' ? 'production' : 'development') as 'development' | 'production' | 'test';
    const port = 3000; // Hardcoded port 3000 as required by environment
    const host = '0.0.0.0';

    const jwtSecret = process.env.JWT_SECRET || 'cos_sec_jwt_sa_production_hardening_2026_key';
    const databaseUrl = process.env.DATABASE_URL;
    const platformName = process.env.PLATFORM_NAME || 'CommerceOS Enterprise';
    
    return {
      env,
      port,
      host,
      jwtSecret,
      databaseUrl,
      platformName,
      corsOrigins: ['*'],
      enableDetailedLogging: env !== 'production' || process.env.LOG_LEVEL === 'debug',
      rateLimit: {
        windowMs: 60 * 1000,
        maxCheckoutRequests: 40,
        maxApiRequests: 300
      },
      security: {
        hmacToleranceSeconds: 300,
        requireHttpsInProd: env === 'production'
      }
    };
  }
}

export const configService = ConfigService.getInstance();
