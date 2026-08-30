import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { configService } from './server/infrastructure/config.ts';
import { logger } from './server/infrastructure/logger.ts';
import { requestIdMiddleware } from './server/middleware/requestId.ts';
import { requestLoggerMiddleware } from './server/middleware/requestLogger.ts';
import { tenantResolver } from './server/middleware/tenantResolver.ts';
import { authMiddleware } from './server/middleware/auth.ts';
import { idempotencyMiddleware } from './server/middleware/idempotency.ts';
import { createRateLimiter } from './server/middleware/rateLimiter.ts';
import { errorHandler } from './server/middleware/errorHandler.ts';

import { HealthController } from './server/controllers/health.controller.ts';
import { authRouter } from './server/routes/auth.ts';
import { tenantsRouter } from './server/routes/tenants.ts';
import { productsRouter } from './server/routes/products.ts';
import { ordersRouter } from './server/routes/orders.ts';
import { couponsRouter } from './server/routes/coupons.ts';
import { staffRouter } from './server/routes/staff.ts';
import { analyticsRouter } from './server/routes/analytics.ts';
import { buildsRouter } from './server/routes/builds.ts';
import { webhooksRouter } from './server/routes/webhooks.ts';
import { paymentsRouter } from './server/routes/payments.ts';
import { abandonedCartsRouter } from './server/routes/abandonedCarts.ts';
import { notificationsRouter } from './server/routes/notifications.ts';
import { codeSigningRouter } from './server/routes/codeSigning.ts';
import { databaseRouter } from './server/routes/database.ts';
import { seedDatabaseIfEmpty } from './src/db/seed.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = configService.get('port');

  // Initialize PostgreSQL seed asynchronously
  seedDatabaseIfEmpty().catch(err => {
    logger.warn('[PostgreSQL] Seed check warning', undefined, err);
  });

  // Request Tracking & Logging
  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);

  // Raw body preservation for cryptographic signature checks
  app.use(express.json({
    limit: '10mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf.toString('utf8');
    }
  }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Global Middlewares: Tenant Isolation, Authentication, Idempotency
  app.use(tenantResolver);
  app.use(authMiddleware);
  app.use(idempotencyMiddleware);

  // Rate Limiting
  const checkoutLimiter = createRateLimiter({
    windowMs: configService.get('rateLimit').windowMs,
    maxRequests: configService.get('rateLimit').maxCheckoutRequests,
    message: 'تم تجاوز معدل محاولات الشراء المسموح به للدقيقة الواحدة. يرجى الانتظار قليلاً.'
  });

  // System Health, Liveness & Readiness Probes
  app.get('/healthz', HealthController.getLiveness);
  app.get('/readyz', HealthController.getReadiness);
  app.get('/api/health', HealthController.getHealth);
  app.get('/api/ready', HealthController.getReadiness);
  app.get('/api/v1/health', HealthController.getHealth);
  app.get('/api/v1/ready', HealthController.getReadiness);

  // API Meta Information
  app.get('/api/v1/meta', (req: Request, res: Response) => {
    res.json({
      name: configService.get('platformName'),
      version: 'v1 (Clean Architecture Hardened)',
      database: 'Cloud SQL PostgreSQL (Drizzle ORM)',
      tenant: req.tenant?.name || 'Default',
      user: req.user?.name || 'Guest',
      role: req.user?.role || 'store_owner',
      endpoints: [
        '/api/v1/auth',
        '/api/v1/tenants',
        '/api/v1/products',
        '/api/v1/orders',
        '/api/v1/coupons',
        '/api/v1/staff',
        '/api/v1/analytics',
        '/api/v1/builds',
        '/api/v1/webhooks',
        '/api/v1/payments',
        '/api/v1/abandoned-carts',
        '/api/v1/notifications',
        '/api/v1/code-signing',
        '/api/v1/db',
        '/api/v1/health',
        '/api/v1/ready'
      ]
    });
  });

  // Mount Clean API Routers under /api/v1
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/tenants', tenantsRouter);
  app.use('/api/v1/products', productsRouter);
  app.use('/api/v1/orders', checkoutLimiter, ordersRouter);
  app.use('/api/v1/coupons', couponsRouter);
  app.use('/api/v1/staff', staffRouter);
  app.use('/api/v1/analytics', analyticsRouter);
  app.use('/api/v1/builds', buildsRouter);
  app.use('/api/v1/webhooks', webhooksRouter);
  app.use('/api/v1/payments', paymentsRouter);
  app.use('/api/v1/abandoned-carts', abandonedCartsRouter);
  app.use('/api/v1/notifications', notificationsRouter);
  app.use('/api/v1/code-signing', codeSigningRouter);
  app.use('/api/v1/db', databaseRouter);

  // Central Error Handler for all API routes
  app.use('/api', errorHandler);

  // Development vs Production Frontend Handling
  if (configService.get('env') !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global fallback error handler
  app.use(errorHandler);

  app.listen(PORT, configService.get('host'), () => {
    logger.info(`🚀 CommerceOS Clean Server running on http://${configService.get('host')}:${PORT}`);
  });
}

startServer().catch(err => {
  logger.error('Fatal Server Boot Error', err);
  process.exit(1);
});
