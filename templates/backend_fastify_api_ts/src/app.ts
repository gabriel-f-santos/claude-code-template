/**
 * 🚀 Fastify TypeScript Vibecoding API - Perfect for rapid development with Claude Code!
 * 
 * This is the main entry point for our Fastify TypeScript application.
 * Built for lightning-fast CRUD operations and live coding sessions.
 */

import fastify from 'fastify';
import dotenv from 'dotenv';
import type { FastifyInstanceWithDecorators } from '@/types/index.js';

// Load environment variables
dotenv.config();

// Create Fastify instance with vibecoding-optimized config
const app = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname'
      }
    } : undefined
  }
}) as FastifyInstanceWithDecorators;

// Register essential plugins for vibecoding
await app.register(import('@fastify/helmet'), {
  contentSecurityPolicy: false // Disable for dev flexibility
});

await app.register(import('@fastify/cors'), {
  origin: process.env.CORS_ORIGIN || true
});

await app.register(import('@fastify/rate-limit'), {
  max: 100,
  timeWindow: '1 minute'
});

// Environment configuration plugin
await app.register(import('@fastify/env'), {
  confKey: 'config',
  schema: {
    type: 'object',
    required: ['PORT'],
    properties: {
      PORT: { type: 'string', default: '3000' },
      NODE_ENV: { type: 'string', default: 'development' },
      JWT_SECRET: { type: 'string', default: 'your-super-secret-jwt-key-change-in-production' },
      DATABASE_URL: { type: 'string', default: 'file:./dev.db' }
    }
  }
});

// Database plugin
await app.register(import('@/plugins/db.js'));

// JWT Authentication plugin  
await app.register(import('@/plugins/auth.js'));

// Swagger documentation - perfect for vibecoding demos!
await app.register(import('@fastify/swagger'), {
  swagger: {
    info: {
      title: 'Fastify TypeScript Vibecoding API',
      description: '🚀 Lightning-fast TypeScript API for rapid development with Claude Code',
      version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'users', description: 'User management endpoints' },
      { name: 'products', description: 'Product management endpoints' }
    ],
    securityDefinitions: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
});

await app.register(import('@fastify/swagger-ui'), {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  staticCSP: true
});

// Health check endpoint - great for vibecoding demos
app.get('/health', {
  schema: {
    description: 'Health check endpoint',
    tags: ['health'],
    response: {
      200: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          timestamp: { type: 'string' },
          uptime: { type: 'number' },
          environment: { type: 'string' },
          typescript: { type: 'boolean' }
        }
      }
    }
  }
}, async (request, reply) => {
  return {
    status: '✅ Healthy and ready for TypeScript vibecoding!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    typescript: true
  };
});

// Root endpoint - perfect for quick tests
app.get('/', {
  schema: {
    description: 'API root endpoint',
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          docs: { type: 'string' },
          version: { type: 'string' },
          typescript: { type: 'boolean' }
        }
      }
    }
  }
}, async (request, reply) => {
  return {
    message: '🚀 Welcome to Fastify TypeScript Vibecoding API!',
    docs: '/docs',
    version: '1.0.0',
    typescript: true
  };
});

// Register route modules
await app.register(import('@/routes/users.routes.js'), { prefix: '/api' });
await app.register(import('@/routes/products.routes.js'), { prefix: '/api' });

// Global error handler with TypeScript support
app.setErrorHandler((error, request, reply) => {
  const { statusCode = 500, message } = error;
  
  app.log.error(error);
  
  reply.code(statusCode).send({
    error: true,
    message: statusCode === 500 ? 'Internal Server Error' : message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: request.url,
    method: request.method
  });
});

// Start server function
async function start(): Promise<void> {
  try {
    const port = parseInt(app.config.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await app.listen({ port, host });
    
    console.log(`
🚀 Fastify TypeScript Vibecoding API is running!

📍 Server: http://localhost:${port}
📖 Docs: http://localhost:${port}/docs  
🏥 Health: http://localhost:${port}/health
🎯 TypeScript: Enabled with full type safety

Ready for rapid development with Claude Code! ⚡
    `);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Gracefully shutting down...');
  await app.close();
  process.exit(0);
});

// Start the server if this file is run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  start();
}

export default app;
export { app };