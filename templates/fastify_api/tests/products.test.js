/**
 * 📦 Product API Tests for Fastify Vibecoding
 * 
 * Comprehensive tests for the product endpoints.
 * Perfect for TDD and vibecoding demonstrations.
 */

import { test, describe, beforeAll, afterAll, beforeEach } from 'vitest';
import { build } from '../src/app.js';

describe('Product API Endpoints', () => {
  let app;
  let userToken;
  let testProduct;

  beforeAll(async () => {
    app = build({ logger: false });
    await app.ready();

    // Create a user and get auth token for protected endpoints
    const userData = {
      username: 'productadmin',
      email: 'admin@example.com',
      name: 'Product Admin',
      password: 'password123'
    };

    await app.inject({
      method: 'POST',
      url: '/api/users/register',
      payload: userData
    });

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: {
        email: userData.email,
        password: userData.password
      }
    });

    userToken = JSON.parse(loginResponse.payload).token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/products', () => {
    test('should create a new product with auth', async () => {
      const productData = {
        name: 'Test Product',
        description: 'This is a test product for vibecoding demos',
        price: 29.99,
        category: 'Electronics',
        imageUrl: 'https://example.com/image.jpg',
        inStock: true
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/products',
        payload: productData,
        headers: {
          authorization: `Bearer ${userToken}`
        }
      });

      expect(response.statusCode).toBe(201);
      const result = JSON.parse(response.payload);
      expect(result.name).toBe(productData.name);
      expect(result.description).toBe(productData.description);
      expect(result.price).toBe(productData.price);
      expect(result.category).toBe(productData.category);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();

      // Store for later tests
      testProduct = result;
    });

    test('should require authentication', async () => {
      const productData = {
        name: 'Unauthorized Product',
        description: 'Should not be created',
        price: 10.00,
        category: 'Test'
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/products',
        payload: productData
      });

      expect(response.statusCode).toBe(401);
    });

    test('should validate required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/products',
        payload: {
          name: 'Incomplete Product'
          // Missing required fields
        },
        headers: {
          authorization: `Bearer ${userToken}`
        }
      });

      expect(response.statusCode).toBe(400);
    });

    test('should validate price format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/products',
        payload: {
          name: 'Invalid Price Product',
          description: 'Product with invalid price',
          price: 'not-a-number',
          category: 'Test'
        },
        headers: {
          authorization: `Bearer ${userToken}`
        }
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/products', () => {
    test('should get products with pagination', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/products?page=1&limit=10'
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.products).toBeInstanceOf(Array);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.filters).toBeDefined();
    });

    test('should filter products by category', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/products?category=Electronics'
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.products).toBeInstanceOf(Array);
      expect(result.filters.category).toBe('Electronics');
    });

    test('should filter products by price range', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/products?minPrice=20&maxPrice=50'
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.products).toBeInstanceOf(Array);
      expect(result.filters.priceRange.min).toBe(20);
      expect(result.filters.priceRange.max).toBe(50);
    });

    test('should search products', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/products?search=test'
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.products).toBeInstanceOf(Array);
      expect(result.filters.search).toBe('test');
    });

    test('should filter by stock status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/products?inStock=true'
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.products).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/products/:id', () => {
    test('should get product by id', async () => {
      if (!testProduct) {
        // Create a test product first
        const productData = {
          name: 'Get Product Test',
          description: 'Product for get by ID test',
          price: 15.99,
          category: 'Test'
        };

        const createResponse = await app.inject({
          method: 'POST',
          url: '/api/products',
          payload: productData,
          headers: {
            authorization: `Bearer ${userToken}`
          }
        });
        testProduct = JSON.parse(createResponse.payload);
      }

      const response = await app.inject({
        method: 'GET',
        url: `/api/products/${testProduct.id}`
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.id).toBe(testProduct.id);
      expect(result.name).toBe(testProduct.name);
    });

    test('should return 404 for non-existent product', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/products/99999'
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /api/products/:id', () => {
    test('should update product with auth', async () => {
      if (!testProduct) {
        // Create a test product first
        const productData = {
          name: 'Update Test Product',
          description: 'Product for update test',
          price: 25.99,
          category: 'Test'
        };

        const createResponse = await app.inject({
          method: 'POST',
          url: '/api/products',
          payload: productData,
          headers: {
            authorization: `Bearer ${userToken}`
          }
        });
        testProduct = JSON.parse(createResponse.payload);
      }

      const updateData = {
        name: 'Updated Product Name',
        price: 35.99
      };

      const response = await app.inject({
        method: 'PUT',
        url: `/api/products/${testProduct.id}`,
        payload: updateData,
        headers: {
          authorization: `Bearer ${userToken}`
        }
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.name).toBe(updateData.name);
      expect(result.price).toBe(updateData.price);
      expect(result.id).toBe(testProduct.id);
    });

    test('should require authentication for update', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/api/products/1`,
        payload: {
          name: 'Should not update'
        }
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('PATCH /api/products/:id/stock', () => {
    test('should update product stock status', async () => {
      if (!testProduct) return;

      const response = await app.inject({
        method: 'PATCH',
        url: `/api/products/${testProduct.id}/stock`,
        payload: {
          inStock: false
        },
        headers: {
          authorization: `Bearer ${userToken}`
        }
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.inStock).toBe(false);
    });

    test('should require authentication for stock update', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/api/products/1/stock',
        payload: {
          inStock: true
        }
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/products/categories', () => {
    test('should get all categories with counts', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/products/categories'
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.categories).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/products/category/:category', () => {
    test('should get products by specific category', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/products/category/Electronics'
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.products).toBeInstanceOf(Array);
      expect(result.category).toBe('Electronics');
      expect(result.pagination).toBeDefined();
    });
  });

  describe('GET /api/products/search/:term', () => {
    test('should search products by term', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/products/search/test'
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.products).toBeInstanceOf(Array);
      expect(result.searchTerm).toBe('test');
      expect(result.pagination).toBeDefined();
    });
  });

  describe('GET /api/products/stats', () => {
    test('should get product statistics', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/products/stats'
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.total).toBeDefined();
      expect(result.inStock).toBeDefined();
      expect(result.outOfStock).toBeDefined();
      expect(result.categories).toBeDefined();
      expect(result.averagePrice).toBeDefined();
    });
  });

  describe('DELETE /api/products/:id', () => {
    test('should delete product with auth', async () => {
      // Create a product to delete
      const productData = {
        name: 'Delete Test Product',
        description: 'Product for delete test',
        price: 5.99,
        category: 'Test'
      };

      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/products',
        payload: productData,
        headers: {
          authorization: `Bearer ${userToken}`
        }
      });
      
      const productToDelete = JSON.parse(createResponse.payload);

      const response = await app.inject({
        method: 'DELETE',
        url: `/api/products/${productToDelete.id}`,
        headers: {
          authorization: `Bearer ${userToken}`
        }
      });

      expect(response.statusCode).toBe(204);
    });

    test('should require authentication for delete', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/api/products/1'
      });

      expect(response.statusCode).toBe(401);
    });
  });
});