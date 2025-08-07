/**
 * 📦 Product Service for Fastify Vibecoding
 * 
 * Business logic for product operations.
 * Clean, testable, and perfect for rapid development.
 */

import { 
  NotFoundError, 
  handleDatabaseError,
  validatePagination 
} from '../utils/error-handler.js';
import { quickValidation } from '../utils/validators.js';

export class ProductsService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Get all products with pagination, search, and filtering
   */
  async getProducts(query = {}) {
    const { page, limit, skip } = validatePagination(query);
    const { search, category, minPrice, maxPrice, inStock } = query;

    // Build where clause for filtering
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = parseFloat(minPrice);
      if (maxPrice !== undefined) where.price.lte = parseFloat(maxPrice);
    }
    
    if (inStock !== undefined) {
      where.inStock = inStock === 'true' || inStock === true;
    }

    try {
      // Get products and total count in parallel - vibecoding efficiency!
      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.product.count({ where })
      ]);

      const pages = Math.ceil(total / limit);

      return {
        products,
        pagination: {
          page,
          limit,
          total,
          pages
        },
        filters: {
          search,
          category,
          priceRange: {
            min: minPrice ? parseFloat(minPrice) : undefined,
            max: maxPrice ? parseFloat(maxPrice) : undefined
          }
        }
      };
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id }
      });

      if (!product) {
        throw new NotFoundError('Product');
      }

      return product;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      handleDatabaseError(error);
    }
  }

  /**
   * Create new product
   */
  async createProduct(productData) {
    // Validate input data
    const validatedData = quickValidation.createProduct(productData);

    // Set default values
    const dataToCreate = {
      ...validatedData,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      imageUrl: productData.imageUrl || null
    };

    try {
      const product = await this.prisma.product.create({
        data: dataToCreate
      });

      return product;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Update product
   */
  async updateProduct(id, productData) {
    // Check if product exists first
    await this.getProductById(id);

    // Filter out undefined values for partial updates
    const dataToUpdate = Object.fromEntries(
      Object.entries(productData).filter(([_, value]) => value !== undefined)
    );

    // Validate the data that's being updated
    if (dataToUpdate.name) {
      dataToUpdate.name = quickValidation.createProduct({ 
        name: dataToUpdate.name, 
        description: 'dummy', 
        price: 0 
      }).name;
    }
    
    if (dataToUpdate.description) {
      dataToUpdate.description = quickValidation.createProduct({ 
        name: 'dummy', 
        description: dataToUpdate.description, 
        price: 0 
      }).description;
    }
    
    if (dataToUpdate.price !== undefined) {
      dataToUpdate.price = quickValidation.createProduct({ 
        name: 'dummy', 
        description: 'dummy', 
        price: dataToUpdate.price 
      }).price;
    }

    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: dataToUpdate
      });

      return product;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(id) {
    try {
      await this.prisma.product.delete({
        where: { id }
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Get all product categories with counts
   */
  async getCategories() {
    try {
      const categories = await this.prisma.product.groupBy({
        by: ['category'],
        _count: {
          category: true
        },
        orderBy: {
          _count: {
            category: 'desc'
          }
        }
      });

      return {
        categories: categories.map(cat => ({
          name: cat.category,
          count: cat._count.category
        }))
      };
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category, query = {}) {
    const { page, limit, skip } = validatePagination(query);

    try {
      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where: { 
            category: { equals: category, mode: 'insensitive' }
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.product.count({
          where: { 
            category: { equals: category, mode: 'insensitive' }
          }
        })
      ]);

      const pages = Math.ceil(total / limit);

      return {
        products,
        category,
        pagination: {
          page,
          limit,
          total,
          pages
        }
      };
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Update product stock status
   */
  async updateStock(id, inStock) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: { inStock }
      });

      return product;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Get product statistics (for dashboards)
   */
  async getProductStats() {
    try {
      const [total, inStock, categories, avgPrice] = await Promise.all([
        this.prisma.product.count(),
        this.prisma.product.count({ where: { inStock: true } }),
        this.prisma.product.groupBy({
          by: ['category'],
          _count: { category: true }
        }),
        this.prisma.product.aggregate({
          _avg: { price: true }
        })
      ]);

      return {
        total,
        inStock,
        outOfStock: total - inStock,
        categories: categories.length,
        averagePrice: avgPrice._avg.price || 0
      };
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Search products (advanced search)
   */
  async searchProducts(searchTerm, query = {}) {
    const { page, limit, skip } = validatePagination(query);

    const where = {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { category: { contains: searchTerm, mode: 'insensitive' } }
      ]
    };

    try {
      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { 
            // Boost exact name matches
            _relevance: {
              fields: ['name', 'description'],
              search: searchTerm,
              sort: 'desc'
            }
          }
        }),
        this.prisma.product.count({ where })
      ]);

      return {
        products,
        searchTerm,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      // Fallback if full-text search is not available
      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.product.count({ where })
      ]);

      return {
        products,
        searchTerm,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    }
  }
}