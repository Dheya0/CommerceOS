import { PaymentService as DbPaymentService, ProcessRefundParams } from '../../src/db/services/paymentService.ts';

export class PaymentRepository {
  public async getTransactions(tenantId: string) {
    return DbPaymentService.listTenantTransactions(tenantId);
  }

  public async getIntentById(id: string, tenantId: string) {
    return DbPaymentService.getPaymentIntent(id, tenantId);
  }

  public async processRefund(params: ProcessRefundParams) {
    return DbPaymentService.processRefund(params);
  }
}

export const paymentRepository = new PaymentRepository();
