/**
 * 📦 Product Controller for Fastify Vibecoding
 * 
 * Clean controller layer that handles HTTP requests and responses.
 * Perfect for rapid CRUD development and live coding sessions.
 */

import { ProductsService } from '../services/products.service.js';
import { asyncHandler } from '../utils/error-handler.js';

export class ProductsController {
  constructor(fastify) {
    this.productsService = new ProductsService(fastify.prisma);
  }

  /**
   * GET /products - Get all products with pagination and filtering
   */
  getProducts = asyncHandler(async (request, reply) => {
    const result = await this.productsService.getProducts(request.query);
    reply.send(result);
  });

  /**
   * GET /products/:id - Get product by ID
   */
  getProductById = asyncHandler(async (request, reply) => {
    const { id } = request.params;
    const productId = parseInt(id);
    
    const product = await this.productsService.getProductById(productId);
    reply.send(product);
  });

  /**
   * POST /products - Create new product (requires auth)
   */
  createProduct = asyncHandler(async (request, reply) => {
    const product = await this.productsService.createProduct(request.body);
    reply.code(201).send(product);
  });

  /**
   * PUT /products/:id - Update product (requires auth)
   */
  updateProduct = asyncHandler(async (request, reply) => {
    const { id } = request.params;
    const productId = parseInt(id);
    
    const product = await this.productsService.updateProduct(productId, request.body);
    reply.send(product);
  });

  /**
   * DELETE /products/:id - Delete product (requires auth)
   */
  deleteProduct = asyncHandler(async (request, reply) => {
    const { id } = request.params;
    const productId = parseInt(id);
    
    await this.productsService.deleteProduct(productId);
    reply.code(204).send();
  });

  /**
   * GET /products/categories - Get all product categories
   */
  getCategories = asyncHandler(async (request, reply) => {
    const result = await this.productsService.getCategories();
    reply.send(result);
  });

  /**
   * GET /products/category/:category - Get products by category
   */
  getProductsByCategory = asyncHandler(async (request, reply) => {
    const { category } = request.params;
    const result = await this.productsService.getProductsByCategory(category, request.query);
    reply.send(result);
  });

  /**
   * PATCH /products/:id/stock - Update product stock status (requires auth)
   */
  updateStock = asyncHandler(async (request, reply) => {
    const { id } = request.params;
    const { inStock } = request.body;
    const productId = parseInt(id);
    
    const product = await this.productsService.updateStock(productId, inStock);
    reply.send(product);
  });

  /**
   * GET /products/stats - Get product statistics (for dashboards)
   */
  getProductStats = asyncHandler(async (request, reply) => {
    const stats = await this.productsService.getProductStats();
    reply.send(stats);
  });

  /**
   * GET /products/search/:term - Advanced product search
   */
  searchProducts = asyncHandler(async (request, reply) => {
    const { term } = request.params;
    const result = await this.productsService.searchProducts(term, request.query);
    reply.send(result);
  });
}