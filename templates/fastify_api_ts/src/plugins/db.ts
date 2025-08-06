/**
 * 🗄️ Database Plugin for Fastify TypeScript Vibecoding
 * 
 * Type-safe Prisma integration perfect for rapid development.
 * Includes connection management and vibecoding-friendly decorators.
 */

import { PrismaClient } from '@prisma/client';
import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import type { FastifyInstanceWithDecorators } from '@/types/index.js';

const dbConnector: FastifyPluginAsync = async (fastify: FastifyInstanceWithDecorators, options) => {
  // Create Prisma client with vibecoding-optimized config
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    errorFormat: 'pretty'
  });

  // Test database connection on startup
  try {
    await prisma.$connect();
    fastify.log.info('🗄️ Database connected successfully!');
  } catch (error) {
    fastify.log.error('❌ Database connection failed:', error);
    throw error;
  }

  // Decorate Fastify instance with Prisma client (type-safe)
  fastify.decorate('prisma', prisma);

  // Add vibecoding-friendly database helpers with proper typing
  fastify.decorate('db', {
    // Quick health check for the database
    async isHealthy(): Promise<boolean> {
      try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
      } catch {
        return false;
      }
    },

    // Helper for transaction-based operations with proper typing
    async transaction<T>(callback: (prisma: PrismaClient) => Promise<T>): Promise<T> {
      return await prisma.$transaction(callback);
    },

    // Disconnect helper for tests
    async disconnect(): Promise<void> {
      await prisma.$disconnect();
    }
  });

  // Clean disconnect on close
  fastify.addHook('onClose', async (instance) => {
    instance.log.info('🔌 Disconnecting from database...');
    await instance.prisma.$disconnect();
  });
};

export default fp(dbConnector, {
  name: 'db-connector',
  dependencies: []
});