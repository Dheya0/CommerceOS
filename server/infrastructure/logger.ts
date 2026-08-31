export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  requestId?: string;
  correlationId?: string;
  tenantId?: string;
  userId?: string;
  route?: string;
  path?: string;
  method?: string;
  status?: number;
  statusCode?: number;
  durationMs?: number;
  latencyMs?: number;
  errorCode?: string;
  ip?: string;
  [key: string]: any;
}

export interface StructuredLogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  requestId?: string;
  correlationId?: string;
  tenantId?: string;
  userId?: string;
  route?: string;
  method?: string;
  status?: number;
  durationMs?: number;
  errorCode?: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
}

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'password_hash',
  'token',
  'secret',
  'clientsecret',
  'client_secret',
  'authorization',
  'cookie',
  'jwt',
  'session',
  'cardnumber',
  'card_number',
  'cvv',
  'cvc',
  'apikey',
  'api_key',
  'privatekey',
  'private_key',
  'signature',
  'bankaccount',
  'bank_account',
  'iban'
]);

export function redactSensitiveData(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => redactSensitiveData(item));
  }

  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      cleaned[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      cleaned[key] = redactSensitiveData(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

class Logger {
  private static instance: Logger;
  private readonly serviceName = 'commerce-api';

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error | any): void {
    const sanitizedContext = context ? redactSensitiveData(context) : {};

    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      message,
      requestId: sanitizedContext.requestId,
      correlationId: sanitizedContext.correlationId,
      tenantId: sanitizedContext.tenantId,
      userId: sanitizedContext.userId,
      route: sanitizedContext.route || sanitizedContext.path,
      method: sanitizedContext.method,
      status: sanitizedContext.status || sanitizedContext.statusCode,
      durationMs: sanitizedContext.durationMs || sanitizedContext.latencyMs,
      errorCode: sanitizedContext.errorCode,
      context: Object.keys(sanitizedContext).length > 0 ? sanitizedContext : undefined
    };

    if (error) {
      entry.error = {
        name: error.name || 'Error',
        message: error.message || String(error),
        code: error.errorCode || error.code || error.statusCode,
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
