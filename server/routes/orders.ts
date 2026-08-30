import { Router } from 'express';
import { requirePermission } from '../middleware/auth.ts';
import { IdempotencyService } from '../../src/db/services/idempotencyService.ts';
import { orderController } from '../controllers/order.controller.ts';
import { validateBody } from '../validators/validator.ts';
import { CreateOrderSchema, UpdateOrderStatusSchema, UpdateOrderPaymentStatusSchema } from '../validators/dtos.ts';

export const ordersRouter = Router();

// Apply DB-backed Idempotency Middleware for order mutations
ordersRouter.use(IdempotencyService.middleware());

// GET /api/v1/orders - List orders (RBAC guarded)
ordersRouter.get('/', requirePermission('orders'), orderController.getOrders);

// GET /api/v1/orders/:id - Get single order (RBAC guarded)
ordersRouter.get('/:id', requirePermission('orders'), orderController.getOrderById);

// POST /api/v1/orders - Storefront / Customer Checkout
ordersRouter.post('/', validateBody(CreateOrderSchema), orderController.createOrder);

// PUT /api/v1/orders/:id/status - Update fulfillment status (RBAC guarded)
ordersRouter.put('/:id/status', requirePermission('orders'), validateBody(UpdateOrderStatusSchema), orderController.updateOrderStatus);

// PUT /api/v1/orders/:id/payment - Update payment status (RBAC guarded)
ordersRouter.put('/:id/payment', requirePermission('orders'), validateBody(UpdateOrderPaymentStatusSchema), orderController.updateOrderPaymentStatus);
