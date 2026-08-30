import { orderRepository, OrderRepository } from '../repositories/order.repository.ts';
import { OrderService as AtomicOrderService } from '../../src/db/services/orderService.ts';
import { NotFoundError, ValidationError, BadRequestError } from '../domain/errors.ts';
import { validateBankReceipt } from '../utils/fileSecurity.ts';
import { Order } from '../../src/types.ts';

export interface CreateOrderParams {
  tenantId: string;
  customer: Order['customer'];
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: Order['paymentMethod'];
  couponCode?: string;
  shippingMethodId?: string;
  bankTransferDetails?: Order['bankTransferDetails'];
  notes?: string;
}

export class OrderService {
  constructor(private orderRepo: OrderRepository = orderRepository) {}

  public async getOrders(tenantId: string, status?: string): Promise<{ orders: Order[]; count: number }> {
    const orders = await this.orderRepo.findByTenant(tenantId, status);
    return { orders, count: orders.length };
  }

  public async getOrderById(id: string, tenantId: string): Promise<Order> {
    const order = await this.orderRepo.findById(id, tenantId);
    if (!order) {
      throw new NotFoundError(`الطلب #${id} غير موجود أو لا ينتمي لهذا المتجر`);
    }
    return order;
  }

  public async createOrder(params: CreateOrderParams) {
    const { customer, items, paymentMethod, bankTransferDetails } = params;

    if (!customer?.name || !customer?.phone) {
      throw new ValidationError('بيانات العميل (الاسم ورقم الجوال) مطلوبة');
    }

    if (!items || items.length === 0) {
      throw new ValidationError('السلة فارغة، يجب اختيار منتج واحد على الأقل');
    }

    // Bank receipt security check
    if (paymentMethod === 'bank_transfer' && bankTransferDetails?.receiptImage?.startsWith('data:')) {
      const fileValidation = validateBankReceipt({
        base64Data: bankTransferDetails.receiptImage
      });
      if (!fileValidation.valid) {
        throw new ValidationError(fileValidation.error || 'ملف الإيصال البنكي غير صالح');
      }
    }

    // Atomic PostgreSQL Transaction with Row Locks
    const txResult = await AtomicOrderService.createOrderTransaction({
      ...params,
      paymentMethod: (params.paymentMethod as any) || 'mada'
    });

    if (!txResult.success) {
      if (txResult.insufficientStockItems?.length) {
        throw new BadRequestError(
          `المخزون غير كافٍ للمنتجات: ${txResult.insufficientStockItems.map(i => i.title).join(', ')}`,
          { insufficientStockItems: txResult.insufficientStockItems }
        );
      }
      throw new BadRequestError(txResult.error || 'فشلت معالجة الطلب');
    }

    return {
      order: txResult.order!,
      paymentIntent: txResult.paymentIntent,
      message: paymentMethod === 'bank_transfer'
        ? 'تم تسجيل طلبك بنجاح وبانتظار التحقق من الحوالة البنكية'
        : 'تم إنشاء الطلب بنجاح ونية الدفع معلقة (Payment Intent PENDING)'
    };
  }

  public async updateStatus(id: string, status: Order['status'], note: string | undefined, tenantId: string): Promise<Order> {
    const updated = await this.orderRepo.updateStatus(id, status, note, tenantId);
    if (!updated) {
      throw new NotFoundError(`تعذر تحديث حالة الطلب #${id} (غير موجود)`);
    }
    return updated;
  }

  public async updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus'], note: string | undefined, tenantId: string): Promise<Order> {
    const updated = await this.orderRepo.updatePaymentStatus(id, paymentStatus, note, tenantId);
    if (!updated) {
      throw new NotFoundError(`تعذر تحديث حالة الدفع للطلب #${id} (غير موجود)`);
    }
    return updated;
  }
}

export const orderService = new OrderService();
