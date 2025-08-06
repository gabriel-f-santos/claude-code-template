/**
 * 📦 Product Routes for Fastify Vibecoding
 * 
 * Clean route definitions with automatic validation and documentation.
 * Perfect for rapid API development and live coding sessions.
 */

import { ProductsController } from '../controllers/products.controller.js';
import { productsSchemas } from '../schemas/products.schema.js';

export default async function productsRoutes(fastify) {
  const productsController = new ProductsController(fastify);

  // Public routes - no authentication required

  /**
   * GET /products - Get all products with pagination and filtering
   * Perfect for vibecoding demos - shows off advanced querying!
   */
  fastify.get('/products', {
    schema: productsSchemas.getProducts
  }, productsController.getProducts);

  /**
   * GET /products/:id - Get product by ID
   * Simple and fast product lookup
   */
  fastify.get('/products/:id', {
    schema: productsSchemas.getProduct
  }, productsController.getProductById);

  /**
   * GET /products/categories - Get all product categories
   * Great for building category filters
   */
  fastify.get('/products/categories', {
    schema: productsSchemas.getCategories
  }, productsController.getCategories);

  /**
   * GET /products/category/:category - Get products by category
   * Category-specific product listing
   */
  fastify.get('/products/category/:category', {
    schema: {
      description: 'Get products by category',
      tags: ['products'],
      params: {
        type: 'object',
        properties: {
          category: { type: 'string', description: 'Category name' }
        },
        required: ['category']
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  price: { type: 'number' },
                  category: { type: 'string' },
                  inStock: { type: 'boolean' }
                }
              }
            },
            category: { type: 'string' },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                pages: { type: 'integer' }
              }
            }
          }
        }
      }
    }
  }, productsController.getProductsByCategory);

  /**
   * GET /products/search/:term - Advanced product search
   * Powerful search across name, description, and category
   */
  fastify.get('/products/search/:term', {
    schema: {
      description: 'Search products by term',
      tags: ['products'],
      params: {
        type: 'object',
        properties: {
          term: { type: 'string', description: 'Search term' }
        },
        required: ['term']
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            products: { type: 'array', items: { type: 'object' } },
            searchTerm: { type: 'string' },
            pagination: { type: 'object' }
          }
        }
      }
    }
  }, productsController.searchProducts);

  // Protected routes - require authentication

  /**
   * POST /products - Create new product
   * Requires JWT authentication - perfect for admin features
   */
  fastify.post('/products', {
    schema: productsSchemas.createProduct,
    preHandler: [fastify.authenticate]
  }, productsController.createProduct);

  /**
   * PUT /products/:id - Update product
   * Full product update with authentication
   */
  fastify.put('/products/:id', {
    schema: productsSchemas.updateProduct,
    preHandler: [fastify.authenticate]
  }, productsController.updateProduct);

  /**
   * DELETE /products/:id - Delete product
   * Requires authentication - admin only
   */
  fastify.delete('/products/:id', {
    schema: productsSchemas.deleteProduct,
    preHandler: [fastify.authenticate]
  }, productsController.deleteProduct);

  /**
   * PATCH /products/:id/stock - Update product stock status
   * Quick stock management endpoint
   */
  fastify.patch('/products/:id/stock', {
    schema: {
      description: 'Update product stock status',
      tags: ['products'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Product ID' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          inStock: { type: 'boolean', description: 'Stock availability' }
        },
        required: ['inStock']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            inStock: { type: 'boolean' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, productsController.updateStock);

  // Analytics and stats routes

  /**
   * GET /products/stats - Get product statistics
   * Great for admin dashboards and vibecoding demos
   */
  fastify.get('/products/stats', {
    schema: {
      description: 'Get product statistics',
      tags: ['products'],
      response: {
        200: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            inStock: { type: 'integer' },
            outOfStock: { type: 'integer' },
            categories: { type: 'integer' },
            averagePrice: { type: 'number' }
          }
        }
      }
    }
  }, productsController.getProductStats);
}