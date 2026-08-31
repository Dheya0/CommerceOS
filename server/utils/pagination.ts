import { ValidationFailedError } from '../domain/errors.ts';

export interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
  allowedSortFields?: string[];
  defaultSortField?: string;
  defaultSortOrder?: 'asc' | 'desc';
}

export interface ValidatedPagination {
  page: number;
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextCursor?: string;
}

export class PaginationHelper {
  public static parse(query: any, options: PaginationOptions = {}): ValidatedPagination {
    const defaultLimit = options.defaultLimit ?? 50;
    const maxLimit = options.maxLimit ?? 100;
    const defaultSortField = options.defaultSortField ?? 'createdAt';
    const defaultSortOrder = options.defaultSortOrder ?? 'desc';
    const allowedSortFields = new Set(options.allowedSortFields || ['createdAt', 'id', 'name', 'title', 'price', 'total', 'status']);

    let page = parseInt(String(query.page || '1'), 10);
    if (isNaN(page) || page < 1) {
      page = 1;
    }

    let limit = parseInt(String(query.limit || defaultLimit), 10);
    if (isNaN(limit) || limit < 1) {
      limit = defaultLimit;
    }
    // Cap strictly at maxLimit to prevent memory exhaustion / DB overload
    if (limit > maxLimit) {
      limit = maxLimit;
    }

    const offset = (page - 1) * limit;

    let sortBy = String(query.sortBy || defaultSortField);
    if (!allowedSortFields.has(sortBy)) {
      sortBy = defaultSortField;
    }

    let sortOrder = String(query.sortOrder || query.order || defaultSortOrder).toLowerCase();
    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      sortOrder = defaultSortOrder;
    }

    return {
      page,
      limit,
      offset,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc'
    };
  }

  public static createMeta(total: number, page: number, limit: number, nextCursor?: string): PaginationMeta {
    const totalPages = Math.ceil(Math.max(0, total) / Math.max(1, limit));
    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      ...(nextCursor ? { nextCursor } : {})
    };
  }

  public static encodeCursor(data: { id: string; createdAt: Date | string }): string {
    const payload = JSON.stringify({
      id: data.id,
      ts: typeof data.createdAt === 'string' ? data.createdAt : data.createdAt.toISOString()
    });
    return Buffer.from(payload, 'utf8').toString('base64url');
  }

  public static decodeCursor(cursor?: string): { id: string; timestamp: Date } | null {
    if (!cursor) return null;
    try {
      const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
      const parsed = JSON.parse(decoded);
      if (!parsed.id || !parsed.ts) return null;
      return {
        id: parsed.id,
        timestamp: new Date(parsed.ts)
      };
    } catch {
      throw new ValidationFailedError('مؤشر التصفح (Cursor) غير صالح');
    }
  }
}
