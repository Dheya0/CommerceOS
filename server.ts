import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { tenantResolver } from './server/middleware/tenantResolver';
import { authMiddleware } from './server/middleware/auth';
import { idempotencyMiddleware } from './server/middleware/idempotency';
import { createRateLimiter } from './server/middleware/rateLimiter';
import { authRouter } from './server/routes/auth';
import { tenantsRouter } from './server/routes/tenants';
import { productsRouter } from './server/routes/products';
import { ordersRouter } from './server/routes/orders';
import { couponsRouter } from './server/routes/coupons';
import { staffRouter } from './server/routes/staff';
import { analyticsRouter } from './server/routes/analytics';
import { buildsRouter } from './server/routes/builds';
import { webhooksRouter } from './server/routes/webhooks';
import { abandonedCartsRouter } from './server/routes/abandonedCarts';
import { notificationsRouter } from './server/routes/notifications';
import { codeSigningRouter } from './server/routes/codeSigning';
import { db } from './server/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic Body Parsers & CORS
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Global Middlewares: Tenant Context, Auth, Idempotency
  app.use(tenantResolver);
  app.use(authMiddleware);
  app.use(idempotencyMiddleware);

  // Rate Limiters for Checkout & Coupon verification
  const checkoutLimiter = createRateLimiter({
    windowMs: 60 * 1000, // 1 min
    maxRequests: 30, // 30 orders/min per IP
    message: 'تم تجاوز معدل محاولات الشراء المسموح به للدقيقة الواحدة. يرجى الانتظار قليلاً.'
  });

  // Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      platform: 'CommerceOS',
      version: '3.9.0-enterprise',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // API Meta Information
  app.get('/api/v1/meta', (req: Request, res: Response) => {
    res.json({
      name: 'CommerceOS API',
      version: 'v1',
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
        '/api/v1/abandoned-carts',
        '/api/v1/notifications',
        '/api/v1/code-signing'
      ]
    });
  });

  // Mount API Routers under /api/v1
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/tenants', tenantsRouter);
  app.use('/api/v1/products', productsRouter);
  app.use('/api/v1/orders', checkoutLimiter, ordersRouter);
  app.use('/api/v1/coupons', couponsRouter);
  app.use('/api/v1/staff', staffRouter);
  app.use('/api/v1/analytics', analyticsRouter);
  app.use('/api/v1/builds', buildsRouter);
  app.use('/api/v1/webhooks', webhooksRouter);
  app.use('/api/v1/abandoned-carts', abandonedCartsRouter);
  app.use('/api/v1/notifications', notificationsRouter);
  app.use('/api/v1/code-signing', codeSigningRouter);

  // Development vs Production Frontend Handling
  if (process.env.NODE_ENV !== 'production') {
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CommerceOS Full-Stack Server running on http://0.0.0.0:${PORT}`);
    console.log(`📦 Loaded ${db.getTenants().length} tenants, ${db.getProducts().length} products, ${db.getOrders().length} orders`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
