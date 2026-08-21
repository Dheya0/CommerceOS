import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requirePermission } from '../middleware/auth';
import { Order } from '../../src/types';

export const ordersRouter = Router();

// GET /api/v1/orders - List orders for tenant
ordersRouter.get('/', (req: Request, res: Response) => {
  const tenantId = (req.query.tenantId as string) || req.tenantId;
  const status = req.query.status as string | undefined;

  let orders = db.getOrders(tenantId);
  if (status && status !== 'all') {
    orders = orders.filter(o => o.status === status);
  }

  res.json({
    orders,
    count: orders.length
  });
});

// GET /api/v1/orders/:id
ordersRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const tenantId = (req.query.tenantId as string) || req.tenantId;
  const order = db.getOrderById(id, tenantId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ order });
});

// POST /api/v1/orders - Atomic Order Creation with Stock Reservation
ordersRouter.post('/', (req: Request, res: Response) => {
  const tenantId = req.body.tenantId || req.tenantId;
  if (!tenantId) {
    return res.status(400).json({ error: 'Missing tenantId' });
  }

  const orderData = {
    ...req.body,
    tenantId
  };

  const result = db.createOrderAtomic(orderData);

  if (!result.success || !result.order) {
    return res.status(400).json({
      success: false,
      error: result.error || 'فشل إنشاء الطلب'
    });
  }

  res.status(201).json({
    success: true,
    order: result.order,
    message: 'تم تأكيد وحجز الطلب بنجاح عبر نظام التجارة المركزي'
  });
});

// PUT /api/v1/orders/:id/status - Update status & append timeline
ordersRouter.put('/:id/status', requirePermission('orders'), (req: Request, res: Response) => {
  const { id } = req.params;
  const tenantId = (req.query.tenantId as string) || req.tenantId;
  const { status, note } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const updated = db.updateOrderStatus(id, status, note, tenantId);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({
    success: true,
    order: updated
  });
});
