import { ValidationSchema } from './validator.ts';
import { ROLES, ORDER_STATUS, PAYMENT_STATUS } from '../domain/constants.ts';

export const LoginSchema: ValidationSchema = {
  email: { type: 'string', required: false },
  password: { type: 'string', required: false },
  role: { type: 'enum', required: false, enumValues: Object.values(ROLES) }
};

export const RegisterSchema: ValidationSchema = {
  name: { type: 'string', required: true, min: 2 },
  email: { type: 'string', required: true },
  password: { type: 'string', required: true, min: 6 }
};

export const SwitchRoleSchema: ValidationSchema = {
  role: { type: 'enum', required: true, enumValues: Object.values(ROLES) }
};

export const CreateOrderSchema: ValidationSchema = {
  customer: { type: 'object', required: true },
  items: { type: 'array', required: true, min: 1 },
  paymentMethod: { type: 'string', required: true }
};

export const UpdateOrderStatusSchema: ValidationSchema = {
  status: { type: 'enum', required: true, enumValues: Object.values(ORDER_STATUS) },
  note: { type: 'string', required: false }
};

export const UpdateOrderPaymentStatusSchema: ValidationSchema = {
  paymentStatus: { type: 'enum', required: true, enumValues: Object.values(PAYMENT_STATUS) },
  note: { type: 'string', required: false }
};

export const CreateProductSchema: ValidationSchema = {
  name: { type: 'string', required: true, min: 2 },
  price: { type: 'number', required: true, min: 0 },
  inventory: { type: 'number', required: true, min: 0 },
  category: { type: 'string', required: false }
};

export const UpdateProductSchema: ValidationSchema = {
  name: { type: 'string', required: false, min: 1 },
  price: { type: 'number', required: false, min: 0 },
  inventory: { type: 'number', required: false, min: 0 }
};

export const CreateTenantSchema: ValidationSchema = {
  name: { type: 'string', required: true, min: 2 },
  slug: { type: 'string', required: true, min: 2 }
};

export const CreateCouponSchema: ValidationSchema = {
  code: { type: 'string', required: true, min: 2 },
  discountPercent: { type: 'number', required: true, min: 1, max: 100 }
};

export const ValidateCouponSchema: ValidationSchema = {
  code: { type: 'string', required: true, min: 1 },
  subtotal: { type: 'number', required: true, min: 0 }
};

export const ProcessRefundSchema: ValidationSchema = {
  paymentIntentId: { type: 'string', required: true },
  amount: { type: 'number', required: true, min: 0.1 },
  reason: { type: 'string', required: true, min: 3 }
};
