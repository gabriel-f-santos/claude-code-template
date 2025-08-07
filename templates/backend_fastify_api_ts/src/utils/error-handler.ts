/**
 * 🚨 Error Handler Utilities for Fastify TypeScript Vibecoding
 * 
 * Type-safe error handling patterns perfect for rapid development.
 * Provides consistent error responses and logging.
 */

import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ErrorResponse } from '@/types/index.js';

// Custom error classes for vibecoding (with proper TypeScript support)
export class ValidationError extends Error {
  public readonly statusCode: number = 400;
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class NotFoundError extends Error {
  public readonly statusCode: number = 404;

  constructor(resource: string = 'Resource') {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  public readonly statusCode: number = 409;

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class UnauthorizedError extends Error {
  public readonly statusCode: number = 401;

  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  public readonly statusCode: number = 403;

  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

// Error response formatter - perfect for vibecoding APIs (Type-safe)
export function formatErrorResponse(error: Error & { statusCode?: number }, request: FastifyRequest): ErrorResponse {
  const response: ErrorResponse = {
    error: true,
    message: error.message,
    statusCode: error.statusCode || 500,
    timestamp: new Date().toISOString()
  };

  // Add request context for debugging
  if (process.env.NODE_ENV === 'development') {
    response.path = request.url;
    response.method = request.method;
    
    if (error instanceof ValidationError && error.field) {
      response.field = error.field;
    }
  }

  return response;
}

// Async error wrapper - prevents unhandled promise rejections (Type-safe)
export function asyncHandler<
  TQuery = unknown,
  TParams = unknown,
  TBody = unknown
>(
  fn: (
    request: FastifyRequest<{
      Querystring: TQuery;
      Params: TParams;
      Body: TBody;
    }>,
    reply: FastifyReply
  ) => Promise<void>
) {
  return async (
    request: FastifyRequest<{
      Querystring: TQuery;
      Params: TParams;
      Body: TBody;
    }>,
    reply: FastifyReply
  ): Promise<void> => {
    try {
      await fn(request, reply);
    } catch (error) {
      throw error;
    }
  };
}

// Validation helper for common patterns (Type-safe)
export function validateRequired(data: Record<string, any>, fields: string[]): void {
  const missing = fields.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missing.join(', ')}`,
      missing[0]
    );
  }
}

// Helper for pagination validation (Type-safe)
export function validatePagination(query: Record<string, any>): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

// Database error handler - converts Prisma errors to friendly messages (Type-safe)
export function handleDatabaseError(error: any): never {
  if (error.code === 'P2002') {
    // Unique constraint violation
    const field = error.meta?.target?.[0] || 'field';
    throw new ConflictError(`${field} already exists`);
  }
  
  if (error.code === 'P2025') {
    // Record not found
    throw new NotFoundError();
  }
  
  if (error.code === 'P2003') {
    // Foreign key constraint
    throw new ValidationError('Invalid reference');
  }
  
  // Re-throw unknown database errors
  throw error;
}