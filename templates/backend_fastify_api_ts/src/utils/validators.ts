/**
 * ✅ Validation Utilities for Fastify TypeScript Vibecoding
 * 
 * Type-safe validation patterns and helpers for rapid development.
 * Perfect for quick CRUD operations and live coding demos.
 */

import { ValidationError } from '@/utils/error-handler.js';
import type {
  UserCreateRequest,
  UserUpdateRequest,
  UserLoginRequest,
  ProductCreateRequest,
  ValidationRules
} from '@/types/index.js';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation (at least 8 chars, 1 letter, 1 number)
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

// Common validation functions for vibecoding (Type-safe)
export const validators = {
  // Email validation
  email(email: string): string {
    if (!email) {
      throw new ValidationError('Email is required', 'email');
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new ValidationError('Invalid email format', 'email');
    }
    return email.toLowerCase().trim();
  },

  // Password validation  
  password(password: string): string {
    if (!password) {
      throw new ValidationError('Password is required', 'password');
    }
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters', 'password');
    }
    if (!PASSWORD_REGEX.test(password)) {
      throw new ValidationError('Password must contain at least one letter and one number', 'password');
    }
    return password;
  },

  // Username validation
  username(username: string): string {
    if (!username) {
      throw new ValidationError('Username is required', 'username');
    }
    if (username.length < 3) {
      throw new ValidationError('Username must be at least 3 characters', 'username');
    }
    if (username.length > 20) {
      throw new ValidationError('Username must be less than 20 characters', 'username');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new ValidationError('Username can only contain letters, numbers, and underscores', 'username');
    }
    return username.trim();
  },

  // Name validation
  name(name: string, fieldName: string = 'name'): string {
    if (!name) {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }
    if (name.length < 2) {
      throw new ValidationError(`${fieldName} must be at least 2 characters`, fieldName);
    }
    if (name.length > 50) {
      throw new ValidationError(`${fieldName} must be less than 50 characters`, fieldName);
    }
    return name.trim();
  },

  // Price validation (for products)
  price(price: number | string): number {
    if (price === undefined || price === null) {
      throw new ValidationError('Price is required', 'price');
    }
    const numPrice = parseFloat(price as string);
    if (isNaN(numPrice)) {
      throw new ValidationError('Price must be a valid number', 'price');
    }
    if (numPrice < 0) {
      throw new ValidationError('Price must be greater than or equal to 0', 'price');
    }
    return numPrice;
  },

  // ID validation (for route parameters)
  id(id: string | number, fieldName: string = 'id'): number {
    if (!id) {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }
    const numId = parseInt(id as string);
    if (isNaN(numId) || numId <= 0) {
      throw new ValidationError(`${fieldName} must be a positive integer`, fieldName);
    }
    return numId;
  },

  // String validation with length constraints
  string(value: string, fieldName: string, minLength: number = 1, maxLength: number = 255): string {
    if (!value) {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }
    if (typeof value !== 'string') {
      throw new ValidationError(`${fieldName} must be a string`, fieldName);
    }
    if (value.length < minLength) {
      throw new ValidationError(`${fieldName} must be at least ${minLength} characters`, fieldName);
    }
    if (value.length > maxLength) {
      throw new ValidationError(`${fieldName} must be less than ${maxLength} characters`, fieldName);
    }
    return value.trim();
  },

  // URL validation
  url(url: string): string {
    if (!url) {
      throw new ValidationError('URL is required', 'url');
    }
    try {
      new URL(url);
      return url;
    } catch {
      throw new ValidationError('Invalid URL format', 'url');
    }
  },

  // Enum validation
  enum<T extends string>(value: T, allowedValues: T[], fieldName: string = 'value'): T {
    if (!allowedValues.includes(value)) {
      throw new ValidationError(
        `${fieldName} must be one of: ${allowedValues.join(', ')}`, 
        fieldName
      );
    }
    return value;
  }
};

// Validation composer - combine multiple validators (Type-safe)
export function validate<T extends Record<string, any>>(data: any, rules: ValidationRules): T {
  const validated: any = {};
  
  for (const [field, validator] of Object.entries(rules)) {
    if (typeof validator === 'function') {
      validated[field] = validator(data[field]);
    } else if (Array.isArray(validator)) {
      // Multiple validators for one field
      let value = data[field];
      for (const v of validator) {
        value = v(value);
      }
      validated[field] = value;
    }
  }
  
  return validated as T;
}

// Quick validation for common patterns (Type-safe)
export const quickValidation = {
  // User creation validation
  createUser(data: any): UserCreateRequest {
    return validate<UserCreateRequest>(data, {
      username: validators.username,
      email: validators.email,
      password: validators.password,
      name: (value: string) => validators.name(value, 'name')
    });
  },

  // User update validation (all fields optional)
  updateUser(data: any): UserUpdateRequest {
    const validated: UserUpdateRequest = {};
    
    if (data.username !== undefined) {
      validated.username = validators.username(data.username);
    }
    if (data.email !== undefined) {
      validated.email = validators.email(data.email);
    }
    if (data.name !== undefined) {
      validated.name = validators.name(data.name, 'name');
    }
    
    return validated;
  },

  // Product validation
  createProduct(data: any): ProductCreateRequest {
    return validate<ProductCreateRequest>(data, {
      name: (value: string) => validators.name(value, 'name'),
      description: (value: string) => validators.string(value, 'description', 10, 1000),
      price: validators.price,
      category: (value: string) => validators.string(value, 'category', 2, 30)
    });
  },

  // Login validation
  login(data: any): UserLoginRequest {
    return validate<UserLoginRequest>(data, {
      email: validators.email,
      password: (value: string) => {
        if (!value) {
          throw new ValidationError('Password is required', 'password');
        }
        return value;
      }
    });
  }
};