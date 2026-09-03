import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller.ts';
import { authService, AuthService } from '../services/auth.service.ts';

export class AuthController extends BaseController {
  constructor(private authSvc: AuthService = authService) {
    super();
  }

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, role, tenantId } = req.body;
      const targetTenantId = tenantId || req.tenantId || '';
      const result = await this.authSvc.login({ email, password, role, tenantId: targetTenantId });
      this.sendSuccess(res, result, 200, 'تم تسجيل الدخول بنجاح');
    } catch (err) {
      next(err);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const result = await this.authSvc.register({ name, email, password });
      this.sendSuccess(res, result, 201, 'تم تسجيل الحساب بنجاح، بانتظار التحقق');
    } catch (err) {
      next(err);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authSvc.logout(req.user?.tokenId, req.user?.id);
      this.sendSuccess(res, { message: 'تم تسجيل الخروج بنجاح' });
    } catch (err) {
      next(err);
    }
  };

  public getSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.sendSuccess(res, {
        authenticated: !!req.user,
        user: req.user || null,
        tenant: req.tenant || null
      });
    } catch (err) {
      next(err);
    }
  };

  public switchRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, tenantId } = req.body;
      const targetTenantId = tenantId || (req.user ? req.user.tenantId : req.tenantId);
      const result = await this.authSvc.switchRole(role, targetTenantId, req.user);
      this.sendSuccess(res, result, 200, `تم التبديل إلى دور (${role})`);
    } catch (err) {
      next(err);
    }
  };
}

export const authController = new AuthController();
