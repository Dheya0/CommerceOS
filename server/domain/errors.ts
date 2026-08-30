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

export class ValidationError extends AppError {
  public readonly statusCode = 400;
  public readonly errorCode = 'VALIDATION_ERROR';

  constructor(message: string = 'بيانات الإدخال غير صالحة', details?: any) {
    super(message, details);
  }
}

export class BadRequestError extends AppError {
  public readonly statusCode = 400;
  public readonly errorCode = 'BAD_REQUEST';

  constructor(message: string = 'طلب غير صالح', details?: any) {
    super(message, details);
  }
}

export class UnauthorizedError extends AppError {
  public readonly statusCode = 401;
  public readonly errorCode = 'UNAUTHORIZED';

  constructor(message: string = 'غير مصرح بالوصول، يرجى تسجيل الدخول', details?: any) {
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

export class NotFoundError extends AppError {
  public readonly statusCode = 404;
  public readonly errorCode = 'NOT_FOUND';

  constructor(message: string = 'المورد المطلوب غير موجود', details?: any) {
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

export class UnprocessableEntityError extends AppError {
  public readonly statusCode = 422;
  public readonly errorCode = 'UNPROCESSABLE_ENTITY';

  constructor(message: string = 'تعذر تنفيذ الإجراء بسبب قيود منطق الأعمال', details?: any) {
    super(message, details);
  }
}

export class TooManyRequestsError extends AppError {
  public readonly statusCode = 429;
  public readonly errorCode = 'TOO_MANY_REQUESTS';

  constructor(message: string = 'تم تجاوز الحد المسموح به من الطلبات', details?: any) {
    super(message, details);
  }
}

export class InternalServerError extends AppError {
  public readonly statusCode = 500;
  public readonly errorCode = 'INTERNAL_SERVER_ERROR';
  public override readonly isOperational = false;

  constructor(message: string = 'حدث خطأ غير متوقع في الخادم', details?: any) {
    super(message, details);
  }
}

export class BadGatewayError extends AppError {
  public readonly statusCode = 502;
  public readonly errorCode = 'BAD_GATEWAY';

  constructor(message: string = 'فشل الاتصال بالخدمة الخارجية أو بوابة الدفع', details?: any) {
    super(message, details);
  }
}
