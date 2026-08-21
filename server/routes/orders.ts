import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requirePermission } from '../middleware/auth';
import { Order } from '../../src/types';

export const ordersRouter = Router();

// GET /api/v1/orders - List orders (RBAC guarded: 'orders')
ordersRouter.get('/', requirePermission('orders'), (req: Request, res: Response) => {
  // STRICT: derives tenant solely from user context
  const tenantId = req.user!.tenantId;
  const status = req.query.status as string | undefined;

  let orders = db.getOrders(tenantId);
  if (status) {
    orders = orders.filter(o => o.status === status);
  }

  res.json({
    orders,
    count: orders.length
  });
});

// GET /api/v1/orders/:id - Get single order (RBAC guarded: 'orders')
ordersRouter.get('/:id', requirePermission('orders'), (req: Request, res: Response) => {
  const { id } = req.params;
  const tenantId = req.user!.tenantId;
  const order = db.getOrderById(id, tenantId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found or not belonging to your store' });
  }

  res.json({ order });
});

/**
 * POST /api/v1/orders - Public/Storefront Checkout Endpoint
 * Hardened against client pricing manipulation:
 * Rebuilds total, tax, and inventory checks on the server.
 */
ordersRouter.post('/', (req: Request, res: Response) => {
  const targetTenantId = req.body.tenantId || req.tenantId;
  const { customer, items, paymentMethod, couponCode, shippingFee } = req.body;

  if (!customer || !customer.name || !customer.phone) {
    return res.status(400).json({ error: 'بيانات العميل (الاسم ورقم الجوال) مطلوبة لإتمام الطلب' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'السلة فارغة، يجب اختيار منتج واحد على الأقل' });
  }

  const result = db.createOrderAtomic({
    tenantId: targetTenantId,
    customer,
    items: items.map((i: any) => ({
      productId: i.productId || i.id,
      quantity: Number(i.quantity) || 1
    })),
    paymentMethod: paymentMethod || 'mada',
    couponCode,
    shippingFee
  });

  if (!result.success) {
    return res.status(400).json({
      error: 'CheckoutFailed',
      message: result.error
    });
  }

  res.status(201).json({
    success: true,
    order: result.order,
    message: 'تم اعتماد الطلب وتأكيد الدفع وحجز المخزون بنجاح'
  });
});

// PUT /api/v1/orders/:id/status - Update status (RBAC guarded: 'orders' with State-Machine verification)
ordersRouter.put('/:id/status', requirePermission('orders'), (req: Request, res: Response) => {
  const { id } = req.params;
  const tenantId = req.user!.tenantId;
  const { status, note } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const result = db.updateOrderStatus(
    id, 
    status as Order['status'], 
    note, 
    tenantId, 
    req.user!.name
  );

  if (!result.success) {
    return res.status(400).json({
      error: 'InvalidTransition',
      message: result.error
    });
  }

  res.json({
    success: true,
    order: result.order,
    message: 'تم تحديث حالة الطلب بنجاح'
  });
});
