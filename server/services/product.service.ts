import { productRepository, ProductRepository } from '../repositories/product.repository.ts';
import { NotFoundError, ValidationError } from '../domain/errors.ts';
import { Product, Category } from '../../src/types.ts';

export class ProductService {
  constructor(private productRepo: ProductRepository = productRepository) {}

  public async getProducts(tenantId: string, filter?: { categoryId?: string; inStockOnly?: boolean; search?: string }): Promise<{ products: Product[]; count: number }> {
    const products = await this.productRepo.findByTenant(tenantId, filter);
    return { products, count: products.length };
  }

  public async getProductById(id: string, tenantId: string): Promise<Product> {
    const product = await this.productRepo.findById(id, tenantId);
    if (!product) {
      throw new NotFoundError(`المنتج #${id} غير موجود في هذا المتجر`);
    }
    return product;
  }

  public async createProduct(productData: Partial<Product>, tenantId: string): Promise<Product> {
    if (!productData.name) {
      throw new ValidationError('اسم المنتج مطلوب');
    }
    return this.productRepo.create({
      ...productData,
      name: productData.name,
      tenantId
    });
  }

  public async updateProduct(id: string, updates: Partial<Product>, tenantId: string): Promise<Product> {
    const updated = await this.productRepo.update(id, updates, tenantId);
    if (!updated) {
      throw new NotFoundError(`المنتج #${id} غير موجود لتحديثه`);
    }
    return updated;
  }

  public async deleteProduct(id: string, tenantId: string): Promise<void> {
    const success = await this.productRepo.delete(id, tenantId);
    if (!success) {
      throw new NotFoundError(`المنتج #${id} غير موجود لحذفه`);
    }
  }

  public async restock(id: string, amount: number, tenantId: string): Promise<Product> {
    const product = await this.getProductById(id, tenantId);
    const newStock = (product.stock || 0) + amount;
    return this.updateProduct(id, { stock: newStock }, tenantId);
  }

  public async getCategories(tenantId: string): Promise<Category[]> {
    return this.productRepo.getCategories(tenantId);
  }

  public async createCategory(categoryData: Partial<Category>, tenantId: string): Promise<Category> {
    if (!categoryData.name) {
      throw new ValidationError('اسم التصنيف مطلوب');
    }
    return this.productRepo.createCategory({
      ...categoryData,
      name: categoryData.name,
      tenantId
    });
  }
}

export const productService = new ProductService();
