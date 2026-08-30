import { Router } from 'express';
import { requirePermission } from '../middleware/auth.ts';
import { productController } from '../controllers/product.controller.ts';
import { validateBody } from '../validators/validator.ts';
import { CreateProductSchema, UpdateProductSchema } from '../validators/dtos.ts';

export const productsRouter = Router();

// GET /api/v1/products - List products
productsRouter.get('/', productController.getProducts);

// GET /api/v1/products/categories/all - Get categories
productsRouter.get('/categories/all', productController.getCategories);

// POST /api/v1/products/categories/all - Create category (RBAC guarded)
productsRouter.post('/categories/all', requirePermission('products'), productController.createCategory);

// GET /api/v1/products/:id - Get single product
productsRouter.get('/:id', productController.getProductById);

// POST /api/v1/products - Create product (RBAC guarded)
productsRouter.post('/', requirePermission('products'), validateBody(CreateProductSchema), productController.createProduct);

// PUT /api/v1/products/:id - Update product (RBAC guarded)
productsRouter.put('/:id', requirePermission('products'), validateBody(UpdateProductSchema), productController.updateProduct);

// DELETE /api/v1/products/:id - Delete product (RBAC guarded)
productsRouter.delete('/:id', requirePermission('products'), productController.deleteProduct);

// POST /api/v1/products/:id/restock - Quick Restock (RBAC guarded)
productsRouter.post('/:id/restock', requirePermission('products'), productController.restockProduct);
