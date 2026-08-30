import { db } from '../db.ts';
import { Product, Category } from '../../src/types.ts';

export class ProductRepository {
  public async findByTenant(tenantId: string, filter?: { categoryId?: string; inStockOnly?: boolean; search?: string }): Promise<Product[]> {
    let products = db.getProducts(tenantId);

    if (filter?.categoryId) {
      products = products.filter(p => p.categoryId === filter.categoryId);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      products = products.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.nameEn || '').toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q)
      );
    }

    if (filter?.inStockOnly) {
      products = products.filter(p => p.stock > 0);
    }

    return products;
  }

  public async findById(id: string, tenantId: string): Promise<Product | undefined> {
    return db.getProductById(id, tenantId);
  }

  public async create(product: Partial<Product> & { name: string; tenantId: string }): Promise<Product> {
    const fullProduct: Product = {
      id: product.id || `prod-${Date.now()}`,
      tenantId: product.tenantId,
      name: product.name,
      nameEn: product.nameEn || product.name,
      description: product.description || '',
      descriptionEn: product.descriptionEn || '',
      categoryId: product.categoryId || 'cat-general',
      price: product.price || 0,
      comparePrice: product.comparePrice,
      costPrice: product.costPrice,
      sku: product.sku || `SKU-${Date.now()}`,
      barcode: product.barcode,
      stock: product.stock !== undefined ? product.stock : 10,
      lowStockAlert: product.lowStockAlert || 3,
      images: product.images || [],
      rating: product.rating || 5.0,
      reviewsCount: product.reviewsCount || 0,
      isFeatured: product.isFeatured || false,
      isNew: product.isNew,
      isBestseller: product.isBestseller,
      tags: product.tags || []
    };
    return db.createProduct(fullProduct);
  }

  public async update(id: string, updates: Partial<Product>, tenantId: string): Promise<Product | null> {
    return db.updateProduct(id, updates, tenantId);
  }

  public async delete(id: string, tenantId: string): Promise<boolean> {
    return db.deleteProduct(id, tenantId);
  }

  public async getCategories(tenantId: string): Promise<Category[]> {
    return db.getCategories(tenantId);
  }

  public async createCategory(category: Partial<Category> & { name: string; tenantId: string }): Promise<Category> {
    const fullCat: Category = {
      id: category.id || `cat-${Date.now()}`,
      tenantId: category.tenantId,
      name: category.name,
      nameEn: category.nameEn || category.name,
      icon: category.icon,
      image: category.image,
      productCount: 0
    };
    return db.createCategory(fullCat);
  }
}

export const productRepository = new ProductRepository();
