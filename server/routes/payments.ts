import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.ts';
import { requirePermission } from '../middleware/auth.ts';
import { validateBody } from '../validators/validator.ts';
import { ProcessRefundSchema } from '../validators/dtos.ts';

export const paymentsRouter = Router();

// GET /api/v1/payments/transactions - List transactions (RBAC guarded)
paymentsRouter.get('/transactions', requirePermission('orders'), paymentController.getTransactions);

// GET /api/v1/payments/intents/:id - Get payment intent details
paymentsRouter.get('/intents/:id', paymentController.getIntent);

// POST /api/v1/payments/refunds - Process full/partial refund (Store Admin / Super Admin)
paymentsRouter.post('/refunds', requirePermission('orders'), validateBody(ProcessRefundSchema), paymentController.processRefund);
