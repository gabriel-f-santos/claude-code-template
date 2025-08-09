/**
 * 👤 Zod Schemas for User Validation
 * 
 * Type-safe validation schemas using Zod library.
 * Perfect for runtime validation with TypeScript inference.
 */

import { z } from 'zod';

// Base user schema for validation
export const userBaseSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z
    .string()
    .email('Please provide a valid email address'),
  
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
});

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number');

// User registration schema
export const userCreateSchema = userBaseSchema.extend({
  password: passwordSchema,
});

// User login schema
export const userLoginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// User update schema (all fields optional)
export const userUpdateSchema = userBaseSchema.partial();

// User ID param schema
export const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive('User ID must be a positive integer'),
});

// Pagination query schema
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

// Type inference from schemas
export type UserCreateRequest = z.infer<typeof userCreateSchema>;
export type UserLoginRequest = z.infer<typeof userLoginSchema>;
export type UserUpdateRequest = z.infer<typeof userUpdateSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

// User response type (without password)
export type UserResponse = Omit<UserCreateRequest, 'password'> & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

// Validation helpers
export const validateUserCreate = (data: unknown): UserCreateRequest => {
  return userCreateSchema.parse(data);
};

export const validateUserLogin = (data: unknown): UserLoginRequest => {
  return userLoginSchema.parse(data);
};

export const validateUserUpdate = (data: unknown): UserUpdateRequest => {
  return userUpdateSchema.parse(data);
};

export const validateUserId = (data: unknown): UserIdParam => {
  return userIdParamSchema.parse(data);
};

export const validatePaginationQuery = (data: unknown): PaginationQuery => {
  return paginationQuerySchema.parse(data);
};