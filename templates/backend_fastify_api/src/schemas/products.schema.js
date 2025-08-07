/**
 * 📦 Product Schemas for Fastify Vibecoding
 * 
 * JSON Schema definitions for product endpoints.
 * Perfect for automatic validation and Swagger documentation.
 */

// Common product properties
const productProperties = {
  id: { type: 'integer', description: 'Product ID' },
  name: { 
    type: 'string', 
    minLength: 2, 
    maxLength: 50,
    description: 'Product name' 
  },
  description: { 
    type: 'string', 
    minLength: 10, 
    maxLength: 1000,
    description: 'Product description' 
  },
  price: { 
    type: 'number', 
    minimum: 0,
    description: 'Product price' 
  },
  imageUrl: {
    type: 'string',
    format: 'uri',
    description: 'Product image URL'
  },
  category: {
    type: 'string',
    minLength: 2,
    maxLength: 30,
    description: 'Product category'
  },
  inStock: {
    type: 'boolean',
    description: 'Product availability status'
  },
  createdAt: { 
    type: 'string', 
    format: 'date-time',
    description: 'Product creation timestamp' 
  },
  updatedAt: { 
    type: 'string', 
    format: 'date-time',
    description: 'Last update timestamp' 
  }
};

// Product response schema
const productResponse = {
  type: 'object',
  properties: {
    id: productProperties.id,
    name: productProperties.name,
    description: productProperties.description,
    price: productProperties.price,
    imageUrl: productProperties.imageUrl,
    category: productProperties.category,
    inStock: productProperties.inStock,
    createdAt: productProperties.createdAt,
    updatedAt: productProperties.updatedAt
  }
};

// Schemas for product endpoints - perfect for vibecoding!
export const productsSchemas = {
  // GET /products - List all products
  getProducts: {
    description: 'Get all products with pagination and filtering',
    tags: ['products'],
    querystring: {
      type: 'object',
      properties: {
        page: { type: 'integer', minimum: 1, default: 1, description: 'Page number' },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 10, description: 'Items per page' },
        search: { type: 'string', description: 'Search by name or description' },
        category: { type: 'string', description: 'Filter by category' },
        minPrice: { type: 'number', minimum: 0, description: 'Minimum price filter' },
        maxPrice: { type: 'number', minimum: 0, description: 'Maximum price filter' },
        inStock: { type: 'boolean', description: 'Filter by stock availability' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: productResponse
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              pages: { type: 'integer' }
            }
          },
          filters: {
            type: 'object',
            properties: {
              search: { type: 'string' },
              category: { type: 'string' },
              priceRange: { 
                type: 'object',
                properties: {
                  min: { type: 'number' },
                  max: { type: 'number' }
                }
              }
            }
          }
        }
      }
    }
  },

  // GET /products/:id - Get product by ID
  getProduct: {
    description: 'Get product by ID',
    tags: ['products'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'Product ID' }
      },
      required: ['id']
    },
    response: {
      200: productResponse,
      404: {
        type: 'object',
        properties: {
          error: { type: 'boolean' },
          message: { type: 'string' },
          statusCode: { type: 'integer' }
        }
      }
    }
  },

  // POST /products - Create new product
  createProduct: {
    description: 'Create a new product',
    tags: ['products'],
    security: [{ bearerAuth: [] }],
    body: {
      type: 'object',
      properties: {
        name: productProperties.name,
        description: productProperties.description,
        price: productProperties.price,
        imageUrl: productProperties.imageUrl,
        category: productProperties.category,
        inStock: { ...productProperties.inStock, default: true }
      },
      required: ['name', 'description', 'price', 'category'],
      additionalProperties: false
    },
    response: {
      201: productResponse,
      400: {
        type: 'object',
        properties: {
          error: { type: 'boolean' },
          message: { type: 'string' },
          statusCode: { type: 'integer' },
          field: { type: 'string' }
        }
      },
      401: {
        type: 'object',
        properties: {
          error: { type: 'boolean' },
          message: { type: 'string' },
          statusCode: { type: 'integer' }
        }
      }
    }
  },

  // PUT /products/:id - Update product
  updateProduct: {
    description: 'Update product information',
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
        name: productProperties.name,
        description: productProperties.description,
        price: productProperties.price,
        imageUrl: productProperties.imageUrl,
        category: productProperties.category,
        inStock: productProperties.inStock
      },
      additionalProperties: false
    },
    response: {
      200: productResponse,
      404: {
        type: 'object',
        properties: {
          error: { type: 'boolean' },
          message: { type: 'string' },
          statusCode: { type: 'integer' }
        }
      }
    }
  },

  // DELETE /products/:id - Delete product
  deleteProduct: {
    description: 'Delete product',
    tags: ['products'],
    security: [{ bearerAuth: [] }],
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'Product ID' }
      },
      required: ['id']
    },
    response: {
      204: {
        type: 'null'
      },
      404: {
        type: 'object',
        properties: {
          error: { type: 'boolean' },
          message: { type: 'string' },
          statusCode: { type: 'integer' }
        }
      }
    }
  },

  // GET /products/categories - Get all product categories
  getCategories: {
    description: 'Get all available product categories',
    tags: ['products'],
    response: {
      200: {
        type: 'object',
        properties: {
          categories: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                count: { type: 'integer' }
              }
            }
          }
        }
      }
    }
  }
};