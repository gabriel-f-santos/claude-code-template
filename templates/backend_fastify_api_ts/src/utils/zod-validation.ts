/**
 * 🛡️ Zod Validation Utilities
 * 
 * Helper functions for Zod validation with proper error handling.
 * Perfect for Fastify preValidation hooks and middleware.
 */

import { ZodSchema, ZodError } from 'zod';
import { FastifyError } from '@fastify/error';

// Custom validation error class
export class ValidationError extends Error {
  public statusCode = 400;
  public validationErrors: Array<{
    field: string;
    message: string;
  }>;

  constructor(zodError: ZodError) {
    const messages = zodError.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    super(`Validation failed: ${messages.join(', ')}`);
    
    this.name = 'ValidationError';
    this.validationErrors = zodError.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
  }
}

// Generic validation function
export const validateWithZod = <T>(schema: ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  }
};

// Safe validation that returns success/error result
export const safeValidateWithZod = <T>(schema: ZodSchema<T>, data: unknown) => {
  return schema.safeParse(data);
};

// Fastify preValidation hook for body validation
export const createBodyValidationHook = <T>(schema: ZodSchema<T>) => {
  return async (request: any, reply: any) => {
    try {
      request.body = validateWithZod(schema, request.body);
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.code(400).send({
          error: true,
          message: error.message,
          statusCode: 400,
          validationErrors: error.validationErrors,
          timestamp: new Date().toISOString()
        });
      }
      throw error;
    }
  };
};

// Fastify preValidation hook for query validation
export const createQueryValidationHook = <T>(schema: ZodSchema<T>) => {
  return async (request: any, reply: any) => {
    try {
      request.query = validateWithZod(schema, request.query);
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.code(400).send({
          error: true,
          message: error.message,
          statusCode: 400,
          validationErrors: error.validationErrors,
          timestamp: new Date().toISOString()
        });
      }
      throw error;
    }
  };
};

// Fastify preValidation hook for params validation
export const createParamsValidationHook = <T>(schema: ZodSchema<T>) => {
  return async (request: any, reply: any) => {
    try {
      request.params = validateWithZod(schema, request.params);
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.code(400).send({
          error: true,
          message: error.message,
          statusCode: 400,
          validationErrors: error.validationErrors,
          timestamp: new Date().toISOString()
        });
      }
      throw error;
    }
  };
};