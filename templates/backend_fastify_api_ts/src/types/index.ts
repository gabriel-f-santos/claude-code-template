/**
 * 🎯 TypeScript Types for Fastify Vibecoding
 * 
 * Clean type definitions for rapid development.
 * Perfect for type-safe vibecoding with excellent DX.
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { PrismaClient, User, Product } from '@prisma/client';

// Fastify instance with custom decorators
export interface FastifyInstanceWithDecorators extends FastifyInstance {
  prisma: PrismaClient;
  authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  optionalAuthenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  generateToken: (payload: Record<string, any>) => string;
  verifyToken: (token: string) => Record<string, any>;
  db: {
    isHealthy(): Promise<boolean>;
    transaction<T>(callback: (prisma: PrismaClient) => Promise<T>): Promise<T>;
    disconnect(): Promise<void>;
  };
  config: {
    PORT: string;
    NODE_ENV: string;
    JWT_SECRET: string;
    DATABASE_URL: string;
  };
  authSchemas: {
    security: Array<{ bearerAuth: string[] }>;
    headers: {
      type: string;
      properties: {
        authorization: {
          type: string;
          description: string;
        };
      };
      required: string[];
    };
  };
}

// User types
export interface UserCreateRequest {
  username: string;
  email: string;
  name: string;
  password: string;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  name?: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
  expiresIn: string;
}

// Product types
export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  inStock?: boolean;
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  inStock?: boolean;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Pagination types
export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedUsersResponse {
  users: UserResponse[];
  pagination: PaginationResponse;
}

// Product query types
export interface ProductQuery extends PaginationQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface PaginatedProductsResponse {
  products: ProductResponse[];
  pagination: PaginationResponse;
  filters: {
    search?: string;
    category?: string;
    priceRange: {
      min?: number;
      max?: number;
    };
  };
}

// Request types with authentication
export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: number;
    email: string;
  };
}

// Route parameter types
export interface IdParam {
  id: string;
}

export interface CategoryParam {
  category: string;
}

export interface SearchParam {
  term: string;
}

// Error types
export interface ErrorResponse {
  error: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string;
  method?: string;
  field?: string;
}

// Service interfaces
export interface IUserService {
  getUsers(query?: PaginationQuery): Promise<PaginatedUsersResponse>;
  getUserById(id: number): Promise<UserResponse>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(userData: UserCreateRequest): Promise<UserResponse>;
  updateUser(id: number, userData: UserUpdateRequest): Promise<UserResponse>;
  deleteUser(id: number): Promise<void>;
  authenticateUser(email: string, password: string): Promise<UserResponse>;
  usernameExists(username: string): Promise<boolean>;
  emailExists(email: string): Promise<boolean>;
  getUserStats(): Promise<{
    total: number;
    recent: number;
    growth: string;
  }>;
}

export interface IProductService {
  getProducts(query?: ProductQuery): Promise<PaginatedProductsResponse>;
  getProductById(id: number): Promise<ProductResponse>;
  createProduct(productData: ProductCreateRequest): Promise<ProductResponse>;
  updateProduct(id: number, productData: ProductUpdateRequest): Promise<ProductResponse>;
  deleteProduct(id: number): Promise<void>;
  getCategories(): Promise<{
    categories: Array<{
      name: string;
      count: number;
    }>;
  }>;
  getProductsByCategory(category: string, query?: PaginationQuery): Promise<{
    products: ProductResponse[];
    category: string;
    pagination: PaginationResponse;
  }>;
  updateStock(id: number, inStock: boolean): Promise<ProductResponse>;
  getProductStats(): Promise<{
    total: number;
    inStock: number;
    outOfStock: number;
    categories: number;
    averagePrice: number;
  }>;
  searchProducts(searchTerm: string, query?: PaginationQuery): Promise<{
    products: ProductResponse[];
    searchTerm: string;
    pagination: PaginationResponse;
  }>;
}

// Validation types
export type ValidatorFunction<T = any> = (value: T) => T;

export interface ValidationRules {
  [key: string]: ValidatorFunction | ValidatorFunction[];
}

// Utility types for better DX
export type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;

export type CreateRequestBody<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRequestBody<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

// Fastify route handler types
export type RouteHandler<TQuery = unknown, TParams = unknown, TBody = unknown> = (
  request: FastifyRequest<{
    Querystring: TQuery;
    Params: TParams;
    Body: TBody;
  }>,
  reply: FastifyReply
) => Promise<void> | void;

export type AuthenticatedRouteHandler<TQuery = unknown, TParams = unknown, TBody = unknown> = (
  request: FastifyRequest<{
    Querystring: TQuery;
    Params: TParams;
    Body: TBody;
  }> & AuthenticatedRequest,
  reply: FastifyReply
) => Promise<void> | void;