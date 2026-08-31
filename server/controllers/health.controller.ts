import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/health.service.ts';
import { metricsCollector } from '../infrastructure/metrics.ts';

export class HealthController {
  public static getHealth = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const health = await HealthService.getHealth();
      const status = health.status === 'healthy' ? 200 : (health.status === 'degraded' ? 200 : 503);
      res.status(status).json(health);
    } catch (err) {
      next(err);
    }
  };

  public static getLiveness = (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'live',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      pid: process.pid
    });
  };

  public static getReadiness = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const readiness = await HealthService.getReadiness();
      if (readiness.ready) {
        res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
      } else {
        res.status(503).json({ status: 'not_ready', reason: readiness.reason, timestamp: new Date().toISOString() });
      }
    } catch (err) {
      next(err);
    }
  };

  public static getMetrics = (req: Request, res: Response) => {
    const format = req.query.format as string;
    if (format === 'prometheus' || req.headers.accept?.includes('text/plain')) {
      res.setHeader('Content-Type', 'text/plain; version=0.0.4');
      res.send(metricsCollector.toPrometheusFormat());
    } else {
      res.status(200).json({
        success: true,
        data: metricsCollector.getSummary(),
        requestId: req.id,
        timestamp: new Date().toISOString()
      });
    }
  };
}
