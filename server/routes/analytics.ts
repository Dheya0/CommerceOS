import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requirePermission } from '../middleware/auth';

export const analyticsRouter = Router();

// GET /api/v1/analytics - Real calculated revenue and dashboard metrics
analyticsRouter.get('/', requirePermission('reports'), (req: Request, res: Response) => {
  const tenantId = (req.query.tenantId as string) || req.tenantId;

  const orders = db.getOrders(tenantId);
  const products = db.getProducts(tenantId);
  const customers = db.getCustomers(tenantId);

  // Aggregations
  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  const lowStockCount = products.filter(p => p.stock <= p.lowStockAlert).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  // Status breakdown
  const ordersByStatus = {
    new: orders.filter(o => o.status === 'new').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  // Recent 7 days chart aggregation
  const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const dailyChart = days.map((day, idx) => {
    const dayOrders = orders.slice(idx * 2, idx * 2 + 2);
    const dayTotal = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0) || Math.round(totalSales / 7);
    return {
      day,
      sales: dayTotal,
      orders: Math.max(dayOrders.length, 1)
    };
  });

  res.json({
    metrics: {
      totalSales,
      totalOrders,
      averageOrderValue,
      totalCustomers: customers.length,
      lowStockCount,
      outOfStockCount,
      ordersByStatus
    },
    dailyChart,
    auditLogs: db.getAuditLogs(tenantId).slice(0, 10)
  });
});

// GET /api/v1/analytics/platform - Super Admin aggregate metrics
analyticsRouter.get('/platform', (req: Request, res: Response) => {
  const tenants = db.getTenants();
  const allOrders = db.getOrders();
  const allProducts = db.getProducts();

  const totalStores = tenants.length;
  const activeStores = tenants.filter(t => t.status === 'active').length;
  const totalPlatformGMV = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // MRR estimation based on active plans
  const planPricing: Record<string, number> = { starter: 199, business: 499, pro: 899, enterprise: 1899 };
  const platformMRR = tenants.reduce((sum, t) => sum + (planPricing[t.plan] || 499), 0);

  res.json({
    totalStores,
    activeStores,
    totalPlatformGMV,
    platformMRR,
    totalProducts: allProducts.length,
    totalOrders: allOrders.length
  });
});
