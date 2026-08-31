import { Request, Response } from 'express';

export interface ApiResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  nextCursor?: string;
  [key: string]: any;
}

export abstract class BaseController {
  protected sendSuccess<T>(
    res: Response,
    data: T,
    statusCode: number = 200,
    metaOrMessage?: ApiResponseMeta | string,
    message?: string
  ): void {
    const req = (res.req || (res as any).request) as Request | undefined;
    const requestId = req?.id || (res.getHeader('X-Request-Id') as string) || undefined;

    let meta: ApiResponseMeta | undefined;
    let msg: string | undefined = message;

    if (typeof metaOrMessage === 'string') {
      msg = metaOrMessage;
    } else if (metaOrMessage) {
      meta = metaOrMessage;
    }

    res.status(statusCode).json({
      success: true,
      data,
      ...(msg ? { message: msg } : {}),
      ...(meta ? { meta } : {}),
      ...(requestId ? { requestId } : {})
    });
  }

  protected sendCreated<T>(
    res: Response,
    data: T,
    metaOrMessage?: ApiResponseMeta | string,
    message?: string
  ): void {
    this.sendSuccess(res, data, 201, metaOrMessage, message);
  }

  protected sendPaginated<T>(
    res: Response,
    items: T[],
    meta: ApiResponseMeta
  ): void {
    this.sendSuccess(res, items, 200, meta);
  }

  protected sendNoContent(res: Response): void {
    res.status(204).send();
  }
}
