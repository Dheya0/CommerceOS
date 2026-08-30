import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller.ts';
import { paymentService, PaymentService } from '../services/payment.service.ts';

export class PaymentController extends BaseController {
  constructor(private paymentSvc: PaymentService = paymentService) {
    super();
  }

  public getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user ? req.user.tenantId : (req.tenantId || 'tenant-royal-honey');
      const transactions = await this.paymentSvc.getTransactions(tenantId);
      this.sendSuccess(res, { transactions, count: transactions.length });
    } catch (err) {
      next(err);
    }
  };

  public getIntent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tenantId = req.user ? req.user.tenantId : (req.tenantId || 'tenant-royal-honey');
      const intent = await this.paymentSvc.getIntentById(id, tenantId);
      this.sendSuccess(res, { paymentIntent: intent });
    } catch (err) {
      next(err);
    }
  };

  public processRefund = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { paymentIntentId, amount, reason } = req.body;
      const tenantId = req.user ? req.user.tenantId : (req.tenantId || 'tenant-royal-honey');
      const initiatedBy = req.user ? req.user.name : 'Store Admin';
      const result = await this.paymentSvc.processRefund({
        paymentIntentId,
        tenantId,
        amount: Number(amount),
        reason,
        initiatedBy
      });
      const message = result.success ? 'تمت معالجة الاسترداد بنجاح' : (result.error || 'فشلت معالجة الاسترداد');
      this.sendSuccess(res, result, 200, message);
    } catch (err) {
      next(err);
    }
  };
}

export const paymentController = new PaymentController();
