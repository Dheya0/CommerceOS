import { db } from '../db.ts';
import { Order } from '../../src/types.ts';

export class OrderRepository {
  public async findByTenant(tenantId: string, status?: string): Promise<Order[]> {
    let orders = db.getOrders(tenantId);
    if (status) {
      orders = orders.filter(o => o.status === status);
    }
    return orders;
  }

  public async findById(id: string, tenantId?: string): Promise<Order | undefined> {
    return db.getOrderById(id, tenantId);
  }

  public async updateStatus(id: string, status: Order['status'], note?: string, tenantId?: string): Promise<Order | null> {
    const result = db.updateOrderStatus(id, status, note, tenantId);
    return result.order || null;
  }

  public async updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus'], note?: string, tenantId?: string): Promise<Order | null> {
    const result = db.updateOrderPaymentStatus(id, paymentStatus, note, tenantId);
    return result.order || null;
  }
}

export const orderRepository = new OrderRepository();
