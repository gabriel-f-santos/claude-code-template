/**
 * 🚨 Error Handler Utilities for Fastify Vibecoding
 * 
 * Clean error handling patterns perfect for rapid development.
 * Provides consistent error responses and logging.
 */

// Custom error classes for vibecoding
export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.field = field;
  }
}

export class NotFoundError extends Error {
  constructor(resource = 'Resource') {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

// Error response formatter - perfect for vibecoding APIs
export function formatErrorResponse(error, request) {
  const response = {
    error: true,
    message: error.message,
    statusCode: error.statusCode || 500,
    timestamp: new Date().toISOString()
  };

  // Add request context for debugging
  if (process.env.NODE_ENV === 'development') {
    response.path = request.url;
    response.method = request.method;
    
    if (error.field) {
      response.field = error.field;
    }
  }

  return response;
}

// Async error wrapper - prevents unhandled promise rejections
export function asyncHandler(fn) {
  return async (request, reply) => {
    try {
      await fn(request, reply);
    } catch (error) {
      throw error;
    }
  };
}

// Validation helper for common patterns
export function validateRequired(data, fields) {
  const missing = fields.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missing.join(', ')}`,
      missing[0]
    );
  }
}

// Helper for pagination validation
export function validatePagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

// Database error handler - converts Prisma errors to friendly messages
export function handleDatabaseError(error) {
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