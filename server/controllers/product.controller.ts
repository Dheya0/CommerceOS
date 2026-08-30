import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller.ts';
import { productService, ProductService } from '../services/product.service.ts';

export class ProductController extends BaseController {
  constructor(private productSvc: ProductService = productService) {
    super();
  }

  public getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user ? req.user.tenantId : req.tenantId;
      const { categoryId, inStock, search } = req.query;
      const result = await this.productSvc.getProducts(tenantId, {
        categoryId: categoryId as string,
        inStockOnly: inStock === 'true',
        search: search as string
      });
      this.sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  };

  public getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tenantId = req.user ? req.user.tenantId : req.tenantId;
      const product = await this.productSvc.getProductById(id, tenantId);
      this.sendSuccess(res, { product });
    } catch (err) {
      next(err);
    }
  };

  public createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const product = await this.productSvc.createProduct(req.body, tenantId);
      this.sendCreated(res, { product }, 'تمت إضافة المنتج بنجاح');
    } catch (err) {
      next(err);
    }
  };

  public updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tenantId = req.user!.tenantId;
      const product = await this.productSvc.updateProduct(id, req.body, tenantId);
      this.sendSuccess(res, { product }, 200, 'تم تحديث المنتج بنجاح');
    } catch (err) {
      next(err);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tenantId = req.user!.tenantId;
      await this.productSvc.deleteProduct(id, tenantId);
      this.sendSuccess(res, { message: 'تم حذف المنتج بنجاح' });
    } catch (err) {
      next(err);
    }
  };

  public restockProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const amount = Number(req.body.amount) || 10;
      const tenantId = req.user!.tenantId;
      const product = await this.productSvc.restock(id, amount, tenantId);
      this.sendSuccess(res, { product }, 200, `تمت زيادة المخزون بمقدار ${amount} قطعة`);
    } catch (err) {
      next(err);
    }
  };

  public getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user ? req.user.tenantId : req.tenantId;
      const categories = await this.productSvc.getCategories(tenantId);
      this.sendSuccess(res, { categories });
    } catch (err) {
      next(err);
    }
  };

  public createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const category = await this.productSvc.createCategory(req.body, tenantId);
      this.sendCreated(res, { category }, 'تم إنشاء التصنيف بنجاح');
    } catch (err) {
      next(err);
    }
  };
}

export const productController = new ProductController();
