/**
 * 🔐 JWT Authentication Plugin for Fastify TypeScript Vibecoding
 * 
 * Type-safe JWT auth perfect for rapid API development.
 * Includes decorators for easy authentication in routes.
 */

import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import type { FastifyInstanceWithDecorators } from '@/types/index.js';

const authPlugin: FastifyPluginAsync = async (fastify: FastifyInstanceWithDecorators, options) => {
  // Register JWT plugin
  await fastify.register(import('@fastify/jwt'), {
    secret: fastify.config.JWT_SECRET,
    sign: {
      expiresIn: '1d'
    }
  });

  // Authentication decorator - perfect for vibecoding! (Type-safe)
  fastify.decorate('authenticate', async function(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.code(401).send({
        error: true,
        message: 'Authentication required',
        statusCode: 401,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Optional authentication decorator (Type-safe)
  fastify.decorate('optionalAuthenticate', async function(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      await request.jwtVerify();
    } catch (error) {
      // Silently fail for optional auth
      (request as any).user = null;
    }
  });

  // Helper to generate JWT tokens - great for vibecoding demos (Type-safe)
  fastify.decorate('generateToken', function(payload: Record<string, any>): string {
    return this.jwt.sign(payload);
  });

  // Helper to verify JWT tokens (Type-safe)
  fastify.decorate('verifyToken', function(token: string): Record<string, any> {
    try {
      return this.jwt.verify(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  });

  // Auth validation schema - reusable across routes (Type-safe)
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
};

export default fp(authPlugin, {
  name: 'auth-plugin',
  dependencies: ['db-connector']
});