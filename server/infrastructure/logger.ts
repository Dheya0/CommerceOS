export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  requestId?: string;
  correlationId?: string;
  tenantId?: string;
  userId?: string;
  path?: string;
  method?: string;
  ip?: string;
  statusCode?: number;
  latencyMs?: number;
  [key: string]: any;
}

export interface StructuredLogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
}

class Logger {
  private static instance: Logger;
  private readonly SENSITIVE_KEYS = new Set([
    'password',
    'token',
    'secret',
    'clientSecret',
    'authorization',
    'cardNumber',
    'cvv',
    'apiKey',
    'privateKey',
    'signature'
  ]);

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private redact(obj: any): any {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.redact(item));
    }

    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (this.SENSITIVE_KEYS.has(key.toLowerCase())) {
        cleaned[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        cleaned[key] = this.redact(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error | any): void {
    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: context ? this.redact(context) : undefined
    };

    if (error) {
      entry.error = {
        name: error.name || 'Error',
        message: error.message || String(error),
        code: error.code || error.statusCode,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
      };
    }

    const formatted = JSON.stringify(entry);

    switch (level) {
      case 'error':
        console.error(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'debug':
        if (process.env.NODE_ENV !== 'production' || process.env.LOG_LEVEL === 'debug') {
          console.debug(formatted);
        }
        break;
      case 'info':
      default:
        console.log(formatted);
        break;
    }
  }

  public info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  public warn(message: string, context?: LogContext, error?: any): void {
    this.log('warn', message, context, error);
  }

  public error(message: string, error?: any, context?: LogContext): void {
    this.log('error', message, context, error);
  }

  public debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }
}

export const logger = Logger.getInstance();
