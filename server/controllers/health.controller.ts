import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/health.service.ts';

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
    res.status(200).json({ status: 'live', timestamp: new Date().toISOString() });
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
}
