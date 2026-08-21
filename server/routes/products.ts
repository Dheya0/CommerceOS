import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requirePermission } from '../middleware/auth';
import { Product, Category } from '../../src/types';

export const productsRouter = Router();

// GET /api/v1/products - List products for tenant (Storefront or Dashboard)
productsRouter.get('/', (req: Request, res: Response) => {
  // For dashboard/authenticated queries, req.tenantId is locked by authMiddleware.
  // For public storefront queries, fallback to req.tenantId resolved by tenantResolver
  const tenantId = req.user ? req.user.tenantId : req.tenantId;
  const categoryId = req.query.categoryId as string | undefined;
  const search = req.query.search as string | undefined;
  const inStockOnly = req.query.inStock === 'true';

  let products = db.getProducts(tenantId);

  if (categoryId) {
    products = products.filter(p => p.categoryId === categoryId);
  }

  if (search) {
    const q = search.toLowerCase().trim();
    products = products.filter(p => 
      (p.name || '').toLowerCase().includes(q) || 
      (p.nameEn || '').toLowerCase().includes(q) || 
      (p.sku || '').toLowerCase().includes(q)
    );
  }

  if (inStockOnly) {
    products = products.filter(p => p.stock > 0);
  }

  res.json({
    products,
    count: products.length
  });
});

// GET /api/v1/products/:id
productsRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const tenantId = req.user ? req.user.tenantId : req.tenantId;
  const product = db.getProductById(id, tenantId);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({ product });
});

// POST /api/v1/products - Create product (RBAC guarded: 'products')
productsRouter.post('/', requirePermission('products'), (req: Request, res: Response) => {
  // STRICT: Tenant is derived solely from authenticated user context
  const tenantId = req.user!.tenantId;

  const prodData: Product = req.body;
  if (!prodData.name || prodData.price === undefined) {
    return res.status(400).json({ error: 'Missing product name or price' });
  }

  const id = prodData.id || `prod-${Date.now()}`;
  const newProduct: Product = {
    ...prodData,
    id,
    tenantId,
    rating: prodData.rating || 5.0,
    reviewsCount: prodData.reviewsCount || 0,
    isFeatured: prodData.isFeatured || false,
    tags: prodData.tags || [],
    images: prodData.images || []
  };

  const created = db.createProduct(newProduct);
  res.status(201).json({
    success: true,
    product: created
  });
});

// PUT /api/v1/products/:id - Update product (RBAC guarded: 'products')
productsRouter.put('/:id', requirePermission('products'), (req: Request, res: Response) => {
  const { id } = req.params;
  const tenantId = req.user!.tenantId;
  const updates = req.body;

  // Prevent tenantId hijacking in payload
  delete updates.tenantId;

  const updated = db.updateProduct(id, updates, tenantId);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found or not in your store' });
  }

  res.json({
    success: true,
    product: updated
  });
});

// DELETE /api/v1/products/:id - Delete product (RBAC guarded: 'products')
productsRouter.delete('/:id', requirePermission('products'), (req: Request, res: Response) => {
  const { id } = req.params;
  const tenantId = req.user!.tenantId;

  const deleted = db.deleteProduct(id, tenantId);
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found or not in your store' });
  }

  res.json({
    success: true,
    message: 'تم حذف المنتج بنجاح'
  });
});

// POST /api/v1/products/:id/restock - Quick inventory restock (RBAC guarded: 'inventory')
productsRouter.post('/:id/restock', requirePermission('inventory'), (req: Request, res: Response) => {
  const { id } = req.params;
  const tenantId = req.user!.tenantId;
  const { amount = 10 } = req.body;

  if (Number(amount) <= 0) {
    return res.status(400).json({ error: 'Restock amount must be a positive number' });
  }

  const updated = db.restockProduct(id, Number(amount), tenantId);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found or not in your store' });
  }

  res.json({
    success: true,
    product: updated
  });
});

// GET /api/v1/products/categories/all - Categories list
productsRouter.get('/categories/all', (req: Request, res: Response) => {
  const tenantId = req.user ? req.user.tenantId : req.tenantId;
  const categories = db.getCategories(tenantId);
  res.json({
    categories
  });
});

// POST /api/v1/products/categories/all - Create category (RBAC guarded: 'products')
productsRouter.post('/categories/all', requirePermission('products'), (req: Request, res: Response) => {
  const tenantId = req.user!.tenantId;
  const catData: Category = req.body;

  const id = catData.id || `cat-${Date.now()}`;
  const newCat: Category = {
    ...catData,
    id,
    tenantId
  };

  const created = db.createCategory(newCat);
  res.status(201).json({
    success: true,
    category: created
  });
});
