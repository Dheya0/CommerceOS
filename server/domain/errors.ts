export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly errorCode: string;
  public readonly isOperational: boolean = true;
  public readonly details?: any;

  constructor(message: string, details?: any) {
    super(message);
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// 1. Authentication & Authorization Errors
export class AuthRequiredError extends AppError {
  public readonly statusCode = 401;
  public readonly errorCode = 'AUTH_REQUIRED';
  constructor(message: string = 'تسجيل الدخول مطلوب للوصول إلى هذا المورد', details?: any) {
    super(message, details);
  }
}

export class AuthInvalidError extends AppError {
  public readonly statusCode = 401;
  public readonly errorCode = 'AUTH_INVALID';
  constructor(message: string = 'بيانات الاعتماد أو الرمز غير صالح', details?: any) {
    super(message, details);
  }
}

export class AuthExpiredError extends AppError {
  public readonly statusCode = 401;
  public readonly errorCode = 'AUTH_EXPIRED';
  constructor(message: string = 'انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول', details?: any) {
    super(message, details);
  }
}

export class ForbiddenError extends AppError {
  public readonly statusCode = 403;
  public readonly errorCode = 'FORBIDDEN';
  constructor(message: string = 'ليس لديك الصلاحية الكافية لتنفيذ هذا الإجراء', details?: any) {
    super(message, details);
  }
}

// 2. Tenant Boundary Errors
export class TenantNotFoundError extends AppError {
  public readonly statusCode = 404;
  public readonly errorCode = 'TENANT_NOT_FOUND';
  constructor(message: string = 'المتجر غير موجود', details?: any) {
    super(message, details);
  }
}

export class TenantAccessDeniedError extends AppError {
  public readonly statusCode = 403;
  public readonly errorCode = 'TENANT_ACCESS_DENIED';
  constructor(message: string = 'تم رفض الوصول إلى بيانات هذا المتجر', details?: any) {
    super(message, details);
  }
}

// 3. Resource & Validation Errors
export class ResourceNotFoundError extends AppError {
  public readonly statusCode = 404;
  public readonly errorCode = 'RESOURCE_NOT_FOUND';
  constructor(message: string = 'المورد المطلوب غير موجود', details?: any) {
    super(message, details);
  }
}

export class ValidationFailedError extends AppError {
  public readonly statusCode = 400;
  public readonly errorCode = 'VALIDATION_FAILED';
  constructor(message: string = 'بيانات الإدخال غير صالحة', details?: any) {
    super(message, details);
  }
}

export class ConflictError extends AppError {
  public readonly statusCode = 409;
  public readonly errorCode = 'CONFLICT';
  constructor(message: string = 'تعارض في حالة المورد الحالي', details?: any) {
    super(message, details);
  }
}

export class IdempotencyConflictError extends AppError {
  public readonly statusCode = 409;
  public readonly errorCode = 'IDEMPOTENCY_CONFLICT';
  constructor(message: string = 'الطلب قيد المعالجة بالفعل أو تم استخدامه مع حمولة مختلفة', details?: any) {
    super(message, details);
  }
}

export class RateLimitedError extends AppError {
  public readonly statusCode = 429;
  public readonly errorCode = 'RATE_LIMITED';
  constructor(message: string = 'تم تجاوز الحد المسموح به من الطلبات، يرجى المحاولة لاحقاً', details?: any) {
    super(message, details);
  }
}

// 4. Commercial & Financial Errors
export class PaymentFailedError extends AppError {
  public readonly statusCode = 402;
  public readonly errorCode = 'PAYMENT_FAILED';
  constructor(message: string = 'فشلت عملية الدفع أو تم رفض البطاقة', details?: any) {
    super(message, details);
  }
}

export class PaymentPendingError extends AppError {
  public readonly statusCode = 402;
  public readonly errorCode = 'PAYMENT_PENDING';
  constructor(message: string = 'عملية الدفع قيد الانتظار أو تتطلب تحقق 3DS', details?: any) {
    super(message, details);
  }
}

export class RefundFailedError extends AppError {
  public readonly statusCode = 422;
  public readonly errorCode = 'REFUND_FAILED';
  constructor(message: string = 'تعذر تنفيذ عملية الاسترداد المالي', details?: any) {
    super(message, details);
  }
}

export class InventoryUnavailableError extends AppError {
  public readonly statusCode = 422;
  public readonly errorCode = 'INVENTORY_UNAVAILABLE';
  constructor(message: string = 'المخزون المتوفر غير كافٍ لإتمام الطلب', details?: any) {
    super(message, details);
  }
}

export class ConcurrencyConflictError extends AppError {
  public readonly statusCode = 409;
  public readonly errorCode = 'CONCURRENCY_CONFLICT';
  constructor(message: string = 'حدث تعارض في التزامن، يرجى إعادة المحاولة', details?: any) {
    super(message, details);
  }
}

// 5. System & Infrastructure Errors
export class InternalError extends AppError {
  public readonly statusCode = 500;
  public readonly errorCode = 'INTERNAL_ERROR';
  public override readonly isOperational = false;
  constructor(message: string = 'حدث خطأ غير متوقع في الخادم', details?: any) {
    super(message, details);
  }
}

export class ServiceUnavailableError extends AppError {
  public readonly statusCode = 503;
  public readonly errorCode = 'SERVICE_UNAVAILABLE';
  public override readonly isOperational = false;
  constructor(message: string = 'الخدمة غير متوفرة حالياً، يرجى المحاولة بعد قليل', details?: any) {
    super(message, details);
  }
}

// Aliases for backwards compatibility
export const ValidationError = ValidationFailedError;
export const BadRequestError = ValidationFailedError;
export const UnauthorizedError = AuthRequiredError;
export const NotFoundError = ResourceNotFoundError;
export const TooManyRequestsError = RateLimitedError;
export const InternalServerError = InternalError;
export const BadGatewayError = ServiceUnavailableError;
export const ConcurrencyError = ConcurrencyConflictError;
export const InventoryError = InventoryUnavailableError;
export const PaymentError = PaymentFailedError;
export const InfrastructureError = ServiceUnavailableError;
export const UnprocessableEntityError = RefundFailedError;
