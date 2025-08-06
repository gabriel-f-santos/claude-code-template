/**
 * 🔐 JWT Authentication Plugin for Fastify Vibecoding
 * 
 * Simple JWT auth perfect for rapid API development.
 * Includes decorators for easy authentication in routes.
 */

import fp from 'fastify-plugin';

async function authPlugin(fastify, options) {
  // Register JWT plugin
  await fastify.register(import('@fastify/jwt'), {
    secret: fastify.config.JWT_SECRET,
    sign: {
      expiresIn: '1d'
    }
  });

  // Authentication decorator - perfect for vibecoding!
  fastify.decorate('authenticate', async function(request, reply) {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.code(401).send({
        error: true,
        message: 'Authentication required',
        statusCode: 401
      });
    }
  });

  // Optional authentication decorator
  fastify.decorate('optionalAuthenticate', async function(request, reply) {
    try {
      await request.jwtVerify();
    } catch (error) {
      // Silently fail for optional auth
      request.user = null;
    }
  });

  // Helper to generate JWT tokens - great for vibecoding demos
  fastify.decorate('generateToken', function(payload) {
    return this.jwt.sign(payload);
  });

  // Helper to verify JWT tokens
  fastify.decorate('verifyToken', function(token) {
    try {
      return this.jwt.verify(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  });

  // Auth validation schema - reusable across routes
  fastify.decorate('authSchemas', {
    security: [{ bearerAuth: [] }],
    headers: {
      type: 'object',
      properties: {
        authorization: {
          type: 'string',
          description: 'Bearer token'
        }
      },
      required: ['authorization']
    }
  });
}

export default fp(authPlugin, {
  name: 'auth-plugin',
  dependencies: ['db-connector']
});