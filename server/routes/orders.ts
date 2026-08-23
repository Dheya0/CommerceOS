import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requirePermission } from '../middleware/auth';
import { Order } from '../../src/types';
import { inventoryMutex } from '../utils/mutex';
import { validateBankReceipt } from '../utils/fileSecurity';

export const ordersRouter = Router();

// GET /api/v1/orders - List orders (RBAC guarded: 'orders')
ordersRouter.get('/', requirePermission('orders'), (req: Request, res: Response) => {
  // STRICT: derives tenant solely from authenticated user context
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
 * Hardened Architecture:
 * 1. Derives tenant SOLELY from Host/TenantResolver (Ignores any client-injected tenantId in body)
 * 2. Race-Condition Protection: Acquires in-memory mutex locks on all items being purchased
 * 3. Zero-Trust Client Pricing: Server calculates product pricing, taxes, and shipping policy
 * 4. Secure Bank Receipt Upload Validation: Sanitizes and checks MIME type & file size
 */
ordersRouter.post('/', async (req: Request, res: Response) => {
  // Strictly enforce tenant context resolved by server middleware from host/header
  const targetTenantId = req.tenantId;
  const { customer, items, paymentMethod, couponCode, shippingMethodId, bankTransferDetails } = req.body;

  if (!customer || !customer.name || !customer.phone) {
    return res.status(400).json({ error: 'بيانات العميل (الاسم ورقم الجوال) مطلوبة لإتمام الطلب' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'السلة فارغة، يجب اختيار منتج واحد على الأقل' });
  }

  // File Security Check for Bank Transfer Receipts
  if (paymentMethod === 'bank_transfer' && bankTransferDetails?.receiptImage) {
    if (bankTransferDetails.receiptImage.startsWith('data:')) {
      const fileValidation = validateBankReceipt({
        base64Data: bankTransferDetails.receiptImage
      });
      if (!fileValidation.valid) {
        return res.status(400).json({
          error: 'InvalidReceiptFile',
          message: fileValidation.error
        });
      }
    }
  }

  // 1. Acquire Atomic Mutex Lock on all item product IDs
  const productIds = items.map((i: any) => i.productId || i.id).filter(Boolean);
  const releaseLocks = await inventoryMutex.acquire(productIds);

  try {
    const result = db.createOrderAtomic({
      tenantId: targetTenantId,
      customer,
      items: items.map((i: any) => ({
        productId: i.productId || i.id,
        quantity: Number(i.quantity) || 1
      })),
      paymentMethod: paymentMethod || 'mada',
      couponCode,
      shippingMethodId,
      bankTransferDetails
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
      message: result.order?.paymentMethod === 'bank_transfer'
        ? 'تم تسجيل طلبك بنجاح وبانتظار التحقق من الحوالة البنكية'
        : 'تم إنشاء الطلب بنجاح وحجز المخزون وحماية تضارب الشراء'
    });
  } finally {
    // 2. Always safely release locks
    releaseLocks();
  }
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

// PUT /api/v1/orders/:id/payment - Verify/Approve payment (RBAC guarded: 'orders')
ordersRouter.put('/:id/payment', requirePermission('orders'), (req: Request, res: Response) => {
  const { id } = req.params;
  const tenantId = req.user!.tenantId;
  const { paymentStatus, note } = req.body;

  if (!paymentStatus || !['paid', 'pending', 'pending_verification', 'failed'].includes(paymentStatus)) {
    return res.status(400).json({ error: 'حالة الدفع غير صالحة' });
  }

  const result = db.updateOrderPaymentStatus(
    id,
    paymentStatus,
    note || `تم تحديث حالة الدفع واعتمادها من قبل ${req.user!.name}`,
    tenantId,
    req.user!.name
  );

  if (!result.success) {
    return res.status(400).json({
      error: 'PaymentUpdateFailed',
      message: result.error
    });
  }

  res.json({
    success: true,
    order: result.order,
    message: 'تم تحديث حالة الدفع واعتماد الطلب بنجاح'
  });
});
