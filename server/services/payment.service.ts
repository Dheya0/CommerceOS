import { paymentRepository, PaymentRepository } from '../repositories/payment.repository.ts';
import { NotFoundError, BadRequestError, ValidationError } from '../domain/errors.ts';

export interface ProcessRefundServiceParams {
  paymentIntentId: string;
  tenantId: string;
  amount: number;
  reason: string;
  initiatedBy: string;
}

export class PaymentService {
  constructor(private paymentRepo: PaymentRepository = paymentRepository) {}

  public async getTransactions(tenantId: string) {
    return this.paymentRepo.getTransactions(tenantId);
  }

  public async getIntentById(id: string, tenantId: string) {
    const intent = await this.paymentRepo.getIntentById(id, tenantId);
    if (!intent) {
      throw new NotFoundError(`نية الدفع #${id} غير موجودة في هذا المتجر`);
    }
    return intent;
  }

  public async processRefund(params: ProcessRefundServiceParams) {
    const { paymentIntentId, tenantId, amount, reason, initiatedBy } = params;

    if (!paymentIntentId) {
      throw new ValidationError('معرف نية الدفع (Payment Intent ID) مطلوب');
    }
    if (!amount || amount <= 0) {
      throw new ValidationError('مبلغ الاسترداد يجب أن يكون أكبر من الصفر');
    }

    const result = await this.paymentRepo.processRefund({
      paymentIntentId,
      tenantId,
      amount,
      reason,
      initiatedBy
    });

    if (!result.success) {
      throw new BadRequestError(result.error || 'فشلت معالجة الاسترداد المالي');
    }

    return result;
  }
}

export const paymentService = new PaymentService();
