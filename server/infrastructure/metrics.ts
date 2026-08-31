export interface LatencyPercentiles {
  p50: number;
  p95: number;
  p99: number;
  avg: number;
  min: number;
  max: number;
  samples: number;
}

export interface SystemMetricsSummary {
  uptimeSeconds: number;
  requests: {
    total: number;
    byStatusCode: Record<string, number>;
    errors4xx: number;
    errors5xx: number;
    rateLimited429: number;
    errorRatePercent: number;
  };
  latency: {
    http: LatencyPercentiles;
    database: LatencyPercentiles;
    paymentGateway: LatencyPercentiles;
  };
  business: {
    checkoutSuccess: number;
    checkoutFailure: number;
    checkoutConversionRatePercent: number;
    refundSuccess: number;
    refundFailure: number;
    webhookSuccess: number;
    webhookFailure: number;
    inventoryConflicts: number;
    idempotencyReplays: number;
    ordersCount: number;
    revenueMinorUnits: number;
  };
  jobs: {
    queueDepth: number;
    completed: number;
    failed: number;
    deadLetter: number;
  };
}

class MetricsCollector {
  private static instance: MetricsCollector;
  private readonly startTime = Date.now();

  private requestCount = 0;
  private statusCodes: Record<string, number> = {};
  private errors4xx = 0;
  private errors5xx = 0;
  private errors429 = 0;

  private httpLatencies: number[] = [];
  private dbLatencies: number[] = [];
  private paymentLatencies: number[] = [];
  private readonly maxSamples = 1000;

  // Business Metrics
  private checkoutSuccess = 0;
  private checkoutFailure = 0;
  private refundSuccess = 0;
  private refundFailure = 0;
  private webhookSuccess = 0;
  private webhookFailure = 0;
  private inventoryConflicts = 0;
  private idempotencyReplays = 0;
  private ordersCount = 0;
  private revenueMinorUnits = 0;

  // Job Queue Metrics
  private queueDepth = 0;
  private jobsCompleted = 0;
  private jobsFailed = 0;
  private jobsDeadLetter = 0;

  private constructor() {}

  public static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  public recordHttpRequest(method: string, route: string, statusCode: number, durationMs: number): void {
    this.requestCount++;
    const codeKey = String(statusCode);
    this.statusCodes[codeKey] = (this.statusCodes[codeKey] || 0) + 1;

    if (statusCode >= 500) {
      this.errors5xx++;
    } else if (statusCode === 429) {
      this.errors429++;
    } else if (statusCode >= 400) {
      this.errors4xx++;
    }

    this.pushSample(this.httpLatencies, durationMs);
  }

  public recordError(statusCode: number, _errorCode?: string): void {
    if (statusCode >= 500) {
      this.errors5xx++;
    } else if (statusCode === 429) {
      this.errors429++;
    } else if (statusCode >= 400) {
      this.errors4xx++;
    }
  }

  public recordDbQuery(durationMs: number): void {
    this.pushSample(this.dbLatencies, durationMs);
  }

  public recordPaymentLatency(durationMs: number): void {
    this.pushSample(this.paymentLatencies, durationMs);
  }

  public recordCheckout(success: boolean, amountMinorUnits: number = 0): void {
    if (success) {
      this.checkoutSuccess++;
      this.ordersCount++;
      this.revenueMinorUnits += amountMinorUnits;
    } else {
      this.checkoutFailure++;
    }
  }

  public recordRefund(success: boolean): void {
    if (success) {
      this.refundSuccess++;
    } else {
      this.refundFailure++;
    }
  }

  public recordWebhook(success: boolean): void {
    if (success) {
      this.webhookSuccess++;
    } else {
      this.webhookFailure++;
    }
  }

  public recordInventoryConflict(): void {
    this.inventoryConflicts++;
  }

  public recordIdempotencyReplay(): void {
    this.idempotencyReplays++;
  }

  public updateQueueMetrics(depth: number, completed: number, failed: number, deadLetter: number): void {
    this.queueDepth = depth;
    this.jobsCompleted = completed;
    this.jobsFailed = failed;
    this.jobsDeadLetter = deadLetter;
  }

  private pushSample(arr: number[], value: number): void {
    arr.push(value);
    if (arr.length > this.maxSamples) {
      arr.shift();
    }
  }

  private calculatePercentiles(samples: number[]): LatencyPercentiles {
    if (samples.length === 0) {
      return { p50: 0, p95: 0, p99: 0, avg: 0, min: 0, max: 0, samples: 0 };
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const count = sorted.length;
    const sum = sorted.reduce((acc, val) => acc + val, 0);

    const getPercentile = (p: number) => {
      const idx = Math.min(Math.floor((p / 100) * count), count - 1);
      return sorted[idx];
    };

    return {
      p50: getPercentile(50),
      p95: getPercentile(95),
      p99: getPercentile(99),
      avg: Math.round((sum / count) * 100) / 100,
      min: sorted[0],
      max: sorted[count - 1],
      samples: count
    };
  }

  public getSummary(): SystemMetricsSummary {
    const totalReq = Math.max(1, this.requestCount);
    const totalErrors = this.errors5xx + this.errors4xx;
    const totalCheckouts = this.checkoutSuccess + this.checkoutFailure;

    return {
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      requests: {
        total: this.requestCount,
        byStatusCode: { ...this.statusCodes },
        errors4xx: this.errors4xx,
        errors5xx: this.errors5xx,
        rateLimited429: this.errors429,
        errorRatePercent: Math.round((totalErrors / totalReq) * 10000) / 100
      },
      latency: {
        http: this.calculatePercentiles(this.httpLatencies),
        database: this.calculatePercentiles(this.dbLatencies),
        paymentGateway: this.calculatePercentiles(this.paymentLatencies)
      },
      business: {
        checkoutSuccess: this.checkoutSuccess,
        checkoutFailure: this.checkoutFailure,
        checkoutConversionRatePercent: totalCheckouts > 0 
          ? Math.round((this.checkoutSuccess / totalCheckouts) * 10000) / 100 
          : 100,
        refundSuccess: this.refundSuccess,
        refundFailure: this.refundFailure,
        webhookSuccess: this.webhookSuccess,
        webhookFailure: this.webhookFailure,
        inventoryConflicts: this.inventoryConflicts,
        idempotencyReplays: this.idempotencyReplays,
        ordersCount: this.ordersCount,
        revenueMinorUnits: this.revenueMinorUnits
      },
      jobs: {
        queueDepth: this.queueDepth,
        completed: this.jobsCompleted,
        failed: this.jobsFailed,
        deadLetter: this.jobsDeadLetter
      }
    };
  }

  public toPrometheusFormat(): string {
    const summary = this.getSummary();
    const lines = [
      '# HELP commerceos_http_requests_total Total HTTP requests received',
      '# TYPE commerceos_http_requests_total counter',
      `commerceos_http_requests_total ${summary.requests.total}`,
      '# HELP commerceos_http_errors_5xx_total Total 5xx HTTP errors',
      '# TYPE commerceos_http_errors_5xx_total counter',
      `commerceos_http_errors_5xx_total ${summary.requests.errors5xx}`,
      '# HELP commerceos_http_latency_p95 95th percentile HTTP latency in ms',
      '# TYPE commerceos_http_latency_p95 gauge',
      `commerceos_http_latency_p95 ${summary.latency.http.p95}`,
      '# HELP commerceos_db_latency_p95 95th percentile DB query latency in ms',
      '# TYPE commerceos_db_latency_p95 gauge',
      `commerceos_db_latency_p95 ${summary.latency.database.p95}`,
      '# HELP commerceos_checkout_success_total Successful checkouts count',
      '# TYPE commerceos_checkout_success_total counter',
      `commerceos_checkout_success_total ${summary.business.checkoutSuccess}`,
      '# HELP commerceos_queue_depth Current background job queue depth',
      '# TYPE commerceos_queue_depth gauge',
      `commerceos_queue_depth ${summary.jobs.queueDepth}`
    ];
    return lines.join('\n');
  }
}

export const metricsCollector = MetricsCollector.getInstance();
