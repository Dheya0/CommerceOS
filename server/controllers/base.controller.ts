import { Response } from 'express';

export abstract class BaseController {
  protected sendSuccess<T>(res: Response, data: T, statusCode: number = 200, message?: string): void {
    res.status(statusCode).json({
      success: true,
      message,
      ...(typeof data === 'object' && data !== null && !Array.isArray(data) ? data : { data })
    });
  }

  protected sendCreated<T>(res: Response, data: T, message?: string): void {
    this.sendSuccess(res, data, 201, message);
  }

  protected sendNoContent(res: Response): void {
    res.status(204).send();
  }
}
