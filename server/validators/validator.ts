import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../domain/errors.ts';

export type ValidationRule<T = any> = (value: T, field: string) => string | null;

export interface SchemaField {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'enum';
  required?: boolean;
  min?: number;
  max?: number;
  enumValues?: readonly string[] | string[];
  custom?: (val: any) => boolean | string;
  items?: SchemaField;
}

export type ValidationSchema = Record<string, SchemaField>;

export class SchemaValidator {
  public static validate(data: Record<string, any>, schema: ValidationSchema): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    for (const [field, rule] of Object.entries(schema)) {
      const value = data ? data[field] : undefined;

      if (rule.required && (value === undefined || value === null || value === '')) {
        if (!errors[field]) errors[field] = [];
        errors[field].push(`حقل ${field} مطلوب`);
        continue;
      }

      if (value === undefined || value === null) {
        continue;
      }

      switch (rule.type) {
        case 'string':
          if (typeof value !== 'string') {
            if (!errors[field]) errors[field] = [];
            errors[field].push(`يجب أن يكون ${field} نصاً`);
          } else {
            if (rule.min !== undefined && value.length < rule.min) {
              if (!errors[field]) errors[field] = [];
              errors[field].push(`يجب ألا يقل طول ${field} عن ${rule.min} حروف`);
            }
            if (rule.max !== undefined && value.length > rule.max) {
              if (!errors[field]) errors[field] = [];
              errors[field].push(`يجب ألا يتجاوز طول ${field} عن ${rule.max} حروف`);
            }
          }
          break;

        case 'number':
          const num = Number(value);
          if (isNaN(num)) {
            if (!errors[field]) errors[field] = [];
            errors[field].push(`يجب أن يكون ${field} رقماً صالحاً`);
          } else {
            if (rule.min !== undefined && num < rule.min) {
              if (!errors[field]) errors[field] = [];
              errors[field].push(`يجب أن تكون قيمة ${field} على الأقل ${rule.min}`);
            }
            if (rule.max !== undefined && num > rule.max) {
              if (!errors[field]) errors[field] = [];
              errors[field].push(`يجب ألا تتجاوز قيمة ${field} عن ${rule.max}`);
            }
          }
          break;

        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (typeof value !== 'string' || !emailRegex.test(value)) {
            if (!errors[field]) errors[field] = [];
            errors[field].push(`البريد الإلكتروني ${field} غير صالح`);
          }
          break;

        case 'boolean':
          if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
            if (!errors[field]) errors[field] = [];
            errors[field].push(`يجب أن يكون ${field} قيمة منطقية (true/false)`);
          }
          break;

        case 'enum':
          if (rule.enumValues && !rule.enumValues.includes(value)) {
            if (!errors[field]) errors[field] = [];
            errors[field].push(`القيمة غير صالحة لحقل ${field}. القيم المسموحة: ${rule.enumValues.join(', ')}`);
          }
          break;

        case 'array':
          if (!Array.isArray(value)) {
            if (!errors[field]) errors[field] = [];
            errors[field].push(`يجب أن يكون ${field} مصفوفة`);
          } else {
            if (rule.min !== undefined && value.length < rule.min) {
              if (!errors[field]) errors[field] = [];
              errors[field].push(`يجب أن تحتوي مصفوفة ${field} على ${rule.min} عناصر على الأقل`);
            }
          }
          break;
      }

      if (rule.custom) {
        const customRes = rule.custom(value);
        if (typeof customRes === 'string') {
          if (!errors[field]) errors[field] = [];
          errors[field].push(customRes);
        } else if (customRes === false) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(`فشل التحقق المخصص للحقل ${field}`);
        }
      }
    }

    return errors;
  }
}

export function validateBody(schema: ValidationSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors = SchemaValidator.validate(req.body, schema);
    if (Object.keys(errors).length > 0) {
      return next(new ValidationError('خطأ في التحقق من صحة البيانات المدخلة', errors));
    }
    next();
  };
}

export function validateQuery(schema: ValidationSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors = SchemaValidator.validate(req.query, schema);
    if (Object.keys(errors).length > 0) {
      return next(new ValidationError('خطأ في معلمات الاستعلام (Query Parameters)', errors));
    }
    next();
  };
}

export function validateParams(schema: ValidationSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors = SchemaValidator.validate(req.params, schema);
    if (Object.keys(errors).length > 0) {
      return next(new ValidationError('خطأ في معلمات المسار (Path Parameters)', errors));
    }
    next();
  };
}
