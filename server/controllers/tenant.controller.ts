import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller.ts';
import { tenantService, TenantService } from '../services/tenant.service.ts';

export class TenantController extends BaseController {
  constructor(private tenantSvc: TenantService = tenantService) {
    super();
  }

  public getTenants = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.tenantSvc.getAllTenants();
      this.sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  };

  public getTenantByIdOrSlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idOrSlug } = req.params;
      const tenant = await this.tenantSvc.getTenantByIdOrSlug(idOrSlug);
      this.sendSuccess(res, { tenant });
    } catch (err) {
      next(err);
    }
  };

  public createTenant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant = await this.tenantSvc.createTenant(req.body);
      this.sendCreated(res, { tenant }, 'تم إنشاء المتجر بنجاح');
    } catch (err) {
      next(err);
    }
  };

  public updateTenant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tenant = await this.tenantSvc.updateTenant(id, req.body);
      this.sendSuccess(res, { tenant }, 200, 'تم تحديث بيانات المتجر بنجاح');
    } catch (err) {
      next(err);
    }
  };

  public updateTenantTheme = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { theme } = req.body;
      const result = await this.tenantSvc.updateTenantTheme(id, theme);
      this.sendSuccess(res, result, 200, 'تم حفظ قالب وهوية المتجر بنجاح');
    } catch (err) {
      next(err);
    }
  };

  public deleteTenant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.tenantSvc.deleteTenant(id);
      this.sendSuccess(res, { message: 'تم حذف المتجر بنجاح' });
    } catch (err) {
      next(err);
    }
  };
}

export const tenantController = new TenantController();
