/**
 * 👤 User Schemas for Fastify TypeScript Vibecoding
 * 
 * Type-safe JSON Schema definitions for user endpoints.
 * Perfect for automatic validation and Swagger documentation.
 */

import type { FastifySchema } from 'fastify';

// Common user properties with TypeScript support
const userProperties = {
  id: { type: 'integer', description: 'User ID' },
  username: { 
    type: 'string', 
    minLength: 3, 
    maxLength: 20, 
    pattern: '^[a-zA-Z0-9_]+$',
    description: 'Username (letters, numbers, underscores only)' 
  },
  email: { 
    type: 'string', 
    format: 'email',
    description: 'User email address' 
  },
  name: { 
    type: 'string', 
    minLength: 2, 
    maxLength: 50,
    description: 'User full name' 
  },
  createdAt: { 
    type: 'string', 
    format: 'date-time',
    description: 'Account creation timestamp' 
  },
  updatedAt: { 
    type: 'string', 
    format: 'date-time',
    description: 'Last update timestamp' 
  }
} as const;

// Password property (for input only)
const passwordProperty = {
  password: { 
    type: 'string', 
    minLength: 8,
    description: 'Password (minimum 8 characters, must contain letter and number)' 
  }
} as const;

// User response schema (without password)
const userResponseSchema = {
  type: 'object',
  properties: {
    id: userProperties.id,
    username: userProperties.username,
    email: userProperties.email,
    name: userProperties.name,
    createdAt: userProperties.createdAt,
    updatedAt: userProperties.updatedAt
  },
  additionalProperties: false
} as const;

// Error response schema
const errorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'boolean' },
    message: { type: 'string' },
    statusCode: { type: 'integer' },
    timestamp: { type: 'string' },
    field: { type: 'string' }
  },
  additionalProperties: false
} as const;

// Schemas for user endpoints - perfect for vibecoding!
export const usersSchemas = {
  // GET /users - List all users
  getUsers: {
    description: 'Get all users with pagination and search',
    tags: ['users'],
    querystring: {
      type: 'object',
      properties: {
        page: { type: 'integer', minimum: 1, default: 1, description: 'Page number' },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 10, description: 'Items per page' },
        search: { type: 'string', description: 'Search by username, name, or email' }
      },
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: userResponseSchema
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              pages: { type: 'integer' }
            },
            additionalProperties: false
          }
        },
        additionalProperties: false
      }
    }
  } as FastifySchema,

  // GET /users/:id - Get user by ID
  getUser: {
    description: 'Get user by ID',
    tags: ['users'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'User ID' }
      },
      required: ['id'],
      additionalProperties: false
    },
    response: {
      200: userResponseSchema,
      404: errorResponseSchema
    }
  } as FastifySchema,

  // POST /users/register - Create new user
  createUser: {
    description: 'Register a new user',
    tags: ['users'],
    body: {
      type: 'object',
      properties: {
        username: userProperties.username,
        email: userProperties.email,
        name: userProperties.name,
        password: passwordProperty.password
      },
      required: ['username', 'email', 'name', 'password'],
      additionalProperties: false
    },
    response: {
      201: userResponseSchema,
      400: errorResponseSchema,
      409: errorResponseSchema
    }
  } as FastifySchema,

  // POST /users/login - User authentication
  loginUser: {
    description: 'User login with email and password',
    tags: ['users'],
    body: {
      type: 'object',
      properties: {
        email: userProperties.email,
        password: { type: 'string', description: 'User password' }
      },
      required: ['email', 'password'],
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          user: userResponseSchema,
          token: { type: 'string', description: 'JWT access token' },
          expiresIn: { type: 'string', description: 'Token expiration time' }
        },
        additionalProperties: false
      },
      401: errorResponseSchema
    }
  } as FastifySchema,

  // PUT /users/:id - Update user
  updateUser: {
    description: 'Update user information',
    tags: ['users'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'User ID' }
      },
      required: ['id'],
      additionalProperties: false
    },
    body: {
      type: 'object',
      properties: {
        username: userProperties.username,
        email: userProperties.email,
        name: userProperties.name
      },
      additionalProperties: false
    },
    response: {
      200: userResponseSchema,
      404: errorResponseSchema,
      400: errorResponseSchema
    }
  } as FastifySchema,

  // DELETE /users/:id - Delete user
  deleteUser: {
    description: 'Delete user by ID',
    tags: ['users'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'User ID' }
      },
      required: ['id'],
      additionalProperties: false
    },
    response: {
      204: { type: 'null' },
      404: errorResponseSchema
    }
  } as FastifySchema,

  // GET /users/me - Get current user profile (requires auth)
  getCurrentUser: {
    description: 'Get current authenticated user profile',
    tags: ['users'],
    security: [{ bearerAuth: [] }],
    response: {
      200: userResponseSchema,
      401: errorResponseSchema
    }
  } as FastifySchema
} as const;