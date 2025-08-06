/**
 * 👤 User Routes for Fastify TypeScript Vibecoding
 * 
 * Type-safe route definitions with automatic validation and documentation.
 * Perfect for rapid API development and live coding sessions.
 */

import type { FastifyPluginAsync } from 'fastify';
import { UsersController } from '@/controllers/users.controller.js';
import { usersSchemas } from '@/schemas/users.schema.js';
import type { FastifyInstanceWithDecorators } from '@/types/index.js';

const usersRoutes: FastifyPluginAsync = async (fastify: FastifyInstanceWithDecorators) => {
  const usersController = new UsersController(fastify);

  // Public routes - no authentication required

  /**
   * POST /users/register - Register new user
   * Perfect for vibecoding demos - creates a user in seconds!
   */
  fastify.post('/users/register', {
    schema: usersSchemas.createUser
  }, usersController.createUser);

  /**
   * POST /users/login - User login
   * Returns JWT token for authentication
   */
  fastify.post('/users/login', {
    schema: usersSchemas.loginUser
  }, usersController.loginUser);

  /**
   * GET /users - Get all users with pagination
   * Great for testing and demonstrations
   */
  fastify.get('/users', {
    schema: usersSchemas.getUsers
  }, usersController.getUsers);

  /**
   * GET /users/:id - Get user by ID
   * Simple and fast user lookup
   */
  fastify.get('/users/:id', {
    schema: usersSchemas.getUser
  }, usersController.getUserById);

  /**
   * PUT /users/:id - Update user
   * Clean user update endpoint
   */
  fastify.put('/users/:id', {
    schema: usersSchemas.updateUser
  }, usersController.updateUser);

  /**
   * DELETE /users/:id - Delete user
   * Simple user deletion
   */
  fastify.delete('/users/:id', {
    schema: usersSchemas.deleteUser
  }, usersController.deleteUser);

  // Protected routes - require authentication

  /**
   * GET /users/me - Get current user profile
   * Requires JWT authentication
   */
  fastify.get('/users/me', {
    schema: usersSchemas.getCurrentUser,
    preHandler: [fastify.authenticate]
  }, usersController.getCurrentUser);

  // Utility routes for frontend integration

  /**
   * POST /users/check-email - Check if email exists
   * Useful for real-time form validation
   */
  fastify.post('/users/check-email', {
    schema: {
      description: 'Check if email already exists',
      tags: ['users'],
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' }
        },
        required: ['email'],
        additionalProperties: false
      },
      response: {
        200: {
          type: 'object',
          properties: {
            exists: { type: 'boolean' }
          }
        }
      }
    }
  }, usersController.checkEmail);

  /**
   * POST /users/check-username - Check if username exists
   * Useful for real-time form validation
   */
  fastify.post('/users/check-username', {
    schema: {
      description: 'Check if username already exists',
      tags: ['users'],
      body: {
        type: 'object',
        properties: {
          username: { type: 'string', minLength: 3, maxLength: 20 }
        },
        required: ['username'],
        additionalProperties: false
      },
      response: {
        200: {
          type: 'object',
          properties: {
            exists: { type: 'boolean' }
          }
        }
      }
    }
  }, usersController.checkUsername);

  /**
   * GET /users/stats - Get user statistics
   * Great for admin dashboards and vibecoding demos
   */
  fastify.get('/users/stats', {
    schema: {
      description: 'Get user statistics',
      tags: ['users'],
      response: {
        200: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            recent: { type: 'integer' },
            growth: { type: 'string' }
          }
        }
      }
    }
  }, usersController.getUserStats);
};

export default usersRoutes;