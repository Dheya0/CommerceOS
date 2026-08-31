import { ServiceUnavailableError, InternalError } from '../domain/errors.ts';
import { logger } from './logger.ts';

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  operationName?: string;
  isRetryable?: (error: any) => boolean;
}

export function isStandardRetryableError(error: any): boolean {
  if (!error) return false;
  
  // Non-retryable HTTP status codes
  const status = error.statusCode || error.status || error.response?.status;
  if (status && status >= 400 && status < 500) {
    // 408 Request Timeout and 429 Too Many Requests can be retried in certain contexts
    if (status === 408 || status === 429) return true;
    return false;
  }

  // Check known retryable error codes / messages
  const code = error.code || error.errorCode || '';
  const msg = (error.message || '').toLowerCase();

  const retryableCodes = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'EAI_AGAIN', 'ESOCKETTIMEDOUT', '40001']; // 40001 is PG serialization_failure
  if (retryableCodes.includes(code)) return true;

  if (
    msg.includes('timeout') ||
    msg.includes('network') ||
    msg.includes('temporarily unavailable') ||
    msg.includes('deadlock') ||
    msg.includes('connection terminated') ||
    msg.includes('econnreset')
  ) {
    return true;
  }

  // 502, 503, 504 server errors are retryable
  if (status === 502 || status === 503 || status === 504) {
    return true;
  }

  return false;
}

/**
 * Executes a promise with an enforced timeout.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 5000,
  operationName: string = 'Operation'
): Promise<T> {
  let timer: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new ServiceUnavailableError(`انتهت مهلة انتظار العملية (${operationName}) بعد ${timeoutMs}ms`, {
        timeoutMs,
        operationName
      }));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}

/**
 * fetch wrapper with default timeout
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 8000
): Promise<globalThis.Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new ServiceUnavailableError(`انتهت مهلة استجابة الخدمة الخارجية (${url}) بعد ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Executes a function with Exponential Backoff and Full Jitter.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const initialDelay = options.initialDelayMs ?? 250;
  const maxDelay = options.maxDelayMs ?? 3000;
  const multiplier = options.backoffMultiplier ?? 2;
  const isRetryable = options.isRetryable ?? isStandardRetryableError;
  const opName = options.operationName ?? 'AsyncOperation';

  let attempt = 0;
  let currentDelay = initialDelay;

  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      if (attempt > maxRetries || !isRetryable(err)) {
        logger.warn(`[Retry Aborted] ${opName} failed after ${attempt} attempt(s): ${err.message}`);
        throw err;
      }

      // Calculate exponential backoff with full jitter (50% - 100% of calculated window)
      const calculatedDelay = Math.min(currentDelay * Math.pow(multiplier, attempt - 1), maxDelay);
      const jitteredDelay = Math.floor(calculatedDelay * (0.5 + Math.random() * 0.5));

      logger.warn(`[Retry Attempt ${attempt}/${maxRetries}] ${opName} error: ${err.message}. Retrying in ${jitteredDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, jitteredDelay));
      currentDelay = calculatedDelay;
    }
  }
}

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold?: number; // consecutive failures before OPEN
  cooldownMs?: number; // time to wait before trying HALF_OPEN
  name?: string;
}

/**
 * Circuit Breaker pattern implementation.
 * States:
 *  - CLOSED: Requests pass normally.
 *  - OPEN: Requests fail-fast without hitting dependency.
 *  - HALF_OPEN: Single trial request to verify dependency recovery.
 */
export class CircuitBreaker {
  private state: CircuitBreakerState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly failureThreshold: number;
  private readonly cooldownMs: number;
  private readonly name: string;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 3;
    this.cooldownMs = options.cooldownMs ?? 5000;
    this.name = options.name ?? 'CircuitBreaker';
  }

  public getState(): CircuitBreakerState {
    if (this.state === 'OPEN' && Date.now() - this.lastFailureTime > this.cooldownMs) {
      this.state = 'HALF_OPEN';
      logger.info(`[Circuit Breaker: ${this.name}] Cooldown elapsed -> Transitioned to HALF_OPEN`);
    }
    return this.state;
  }

  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    const currentState = this.getState();

    if (currentState === 'OPEN') {
      logger.warn(`[Circuit Breaker: ${this.name}] Fast-failing request (Circuit is OPEN)`);
      throw new ServiceUnavailableError(`الخدمة الخارجية (${this.name}) غير متاحة مؤقتاً (Circuit Breaker OPEN)`, {
        circuit: this.name,
        state: 'OPEN'
      });
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err: any) {
      this.onFailure(err);
      throw err;
    }
  }

  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      logger.info(`[Circuit Breaker: ${this.name}] Trial request succeeded -> Reset to CLOSED`);
    }
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(err: any): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'HALF_OPEN' || this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      logger.error(`[Circuit Breaker: ${this.name}] Failure threshold reached (${this.failureCount}) -> Tripped to OPEN`, err);
    }
  }

  public reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}

/**
 * Bulkhead Concurrency Limiter
 * Isolates high-load resources and prevents cascading exhaustion.
 */
export class Bulkhead {
  private activeCount = 0;
  private readonly maxConcurrent: number;
  private readonly maxQueue: number;
  private queue: Array<() => void> = [];
  private readonly name: string;

  constructor(maxConcurrent: number = 10, maxQueue: number = 20, name: string = 'Bulkhead') {
    this.maxConcurrent = maxConcurrent;
    this.maxQueue = maxQueue;
    this.name = name;
  }

  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.activeCount >= this.maxConcurrent) {
      if (this.queue.length >= this.maxQueue) {
        throw new ServiceUnavailableError(`تم تجاوز الطاقة الاستيعابية للعملية (${this.name})، يرجى الانتظار`, {
          bulkhead: this.name,
          active: this.activeCount,
          queued: this.queue.length
        });
      }

      await new Promise<void>(resolve => {
        this.queue.push(resolve);
      });
    }

    this.activeCount++;
    try {
      return await fn();
    } finally {
      this.activeCount--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        next?.();
      }
    }
  }

  public getStats() {
    return {
      name: this.name,
      active: this.activeCount,
      queued: this.queue.length,
      maxConcurrent: this.maxConcurrent,
      maxQueue: this.maxQueue
    };
  }
}
