import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller.ts';
import { orderService, OrderService } from '../services/order.service.ts';

export class OrderController extends BaseController {
  constructor(private orderSvc: OrderService = orderService) {
    super();
  }

  public getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const status = req.query.status as string | undefined;
      const result = await this.orderSvc.getOrders(tenantId, status);
      this.sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  };

  public getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tenantId = req.user!.tenantId;
      const order = await this.orderSvc.getOrderById(id, tenantId);
      this.sendSuccess(res, { order });
    } catch (err) {
      next(err);
    }
  };

  public createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const targetTenantId = req.tenantId;
      const { customer, items, paymentMethod, couponCode, shippingMethodId, bankTransferDetails, notes } = req.body;

      const result = await this.orderSvc.createOrder({
        tenantId: targetTenantId,
        customer,
        items,
        paymentMethod,
        couponCode,
        shippingMethodId,
        bankTransferDetails,
        notes
      });

      this.sendCreated(res, result, result.message);
    } catch (err) {
      next(err);
    }
  };

  public updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, note } = req.body;
      const tenantId = req.user!.tenantId;
      const order = await this.orderSvc.updateStatus(id, status, note, tenantId);
      this.sendSuccess(res, { order }, 200, 'تم تحديث حالة الطلب بنجاح');
    } catch (err) {
      next(err);
    }
  };

  public updateOrderPaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { paymentStatus, note } = req.body;
      const tenantId = req.user!.tenantId;
      const order = await this.orderSvc.updatePaymentStatus(id, paymentStatus, note, tenantId);
      this.sendSuccess(res, { order }, 200, 'تم تحديث حالة الدفع للطلب بنجاح');
    } catch (err) {
      next(err);
    }
  };
}

export const orderController = new OrderController();
