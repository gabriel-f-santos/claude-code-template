/**
 * 👤 User Schemas for Fastify Vibecoding
 * 
 * JSON Schema definitions for user endpoints.
 * Perfect for automatic validation and Swagger documentation.
 */

// Common user properties
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
};

// Password property (for input only)
const passwordProperty = {
  password: { 
    type: 'string', 
    minLength: 8,
    description: 'Password (minimum 8 characters, must contain letter and number)' 
  }
};

// User response schema (without password)
const userResponse = {
  type: 'object',
  properties: {
    id: userProperties.id,
    username: userProperties.username,
    email: userProperties.email,
    name: userProperties.name,
    createdAt: userProperties.createdAt,
    updatedAt: userProperties.updatedAt
  }
};

// Schemas for user endpoints - perfect for vibecoding!
export const usersSchemas = {
  // GET /users - List all users
  getUsers: {
    description: 'Get all users with pagination',
    tags: ['users'],
    querystring: {
      type: 'object',
      properties: {
        page: { type: 'integer', minimum: 1, default: 1, description: 'Page number' },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 10, description: 'Items per page' },
        search: { type: 'string', description: 'Search by username or name' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: userResponse
          },
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
  },

  // GET /users/:id - Get user by ID
  getUser: {
    description: 'Get user by ID',
    tags: ['users'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'User ID' }
      },
      required: ['id']
    },
    response: {
      200: userResponse,
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
      201: userResponse,
      400: {
        type: 'object',
        properties: {
          error: { type: 'boolean' },
          message: { type: 'string' },
          statusCode: { type: 'integer' },
          field: { type: 'string' }
        }
      },
      409: {
        type: 'object',
        properties: {
          error: { type: 'boolean' },
          message: { type: 'string' },
          statusCode: { type: 'integer' }
        }
      }
    }
  },

  // POST /users/login - User authentication
  loginUser: {
    description: 'User login',
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
          user: userResponse,
          token: { type: 'string', description: 'JWT access token' },
          expiresIn: { type: 'string', description: 'Token expiration time' }
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

  // PUT /users/:id - Update user
  updateUser: {
    description: 'Update user information',
    tags: ['users'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'User ID' }
      },
      required: ['id']
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
      200: userResponse,
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

  // DELETE /users/:id - Delete user
  deleteUser: {
    description: 'Delete user',
    tags: ['users'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'User ID' }
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

  // GET /users/me - Get current user profile (requires auth)
  getCurrentUser: {
    description: 'Get current user profile',
    tags: ['users'],
    security: [{ bearerAuth: [] }],
    response: {
      200: userResponse,
      401: {
        type: 'object',
        properties: {
          error: { type: 'boolean' },
          message: { type: 'string' },
          statusCode: { type: 'integer' }
        }
      }
    }
  }
};