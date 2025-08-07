/**
 * ✅ Validation Utilities for Fastify Vibecoding
 * 
 * Common validation patterns and helpers for rapid development.
 * Perfect for quick CRUD operations and live coding demos.
 */

import { ValidationError } from './error-handler.js';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation (at least 8 chars, 1 letter, 1 number)
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

// Common validation functions for vibecoding
export const validators = {
  // Email validation
  email(email) {
    if (!email) {
      throw new ValidationError('Email is required', 'email');
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new ValidationError('Invalid email format', 'email');
    }
    return email.toLowerCase().trim();
  },

  // Password validation  
  password(password) {
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
  username(username) {
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
  name(name, fieldName = 'name') {
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
  price(price) {
    if (price === undefined || price === null) {
      throw new ValidationError('Price is required', 'price');
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) {
      throw new ValidationError('Price must be a valid number', 'price');
    }
    if (numPrice < 0) {
      throw new ValidationError('Price must be greater than or equal to 0', 'price');
    }
    return numPrice;
  },

  // ID validation (for route parameters)
  id(id, fieldName = 'id') {
    if (!id) {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }
    const numId = parseInt(id);
    if (isNaN(numId) || numId <= 0) {
      throw new ValidationError(`${fieldName} must be a positive integer`, fieldName);
    }
    return numId;
  },

  // String validation with length constraints
  string(value, fieldName, minLength = 1, maxLength = 255) {
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
  url(url) {
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
  enum(value, allowedValues, fieldName = 'value') {
    if (!allowedValues.includes(value)) {
      throw new ValidationError(
        `${fieldName} must be one of: ${allowedValues.join(', ')}`, 
        fieldName
      );
    }
    return value;
  }
};

// Validation composer - combine multiple validators
export function validate(data, rules) {
  const validated = {};
  
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
  
  return validated;
}

// Quick validation for common patterns
export const quickValidation = {
  // User creation validation
  createUser(data) {
    return validate(data, {
      username: validators.username,
      email: validators.email,
      password: validators.password,
      name: (value) => validators.name(value, 'name')
    });
  },

  // User update validation (all fields optional)
  updateUser(data) {
    const validated = {};
    
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
  createProduct(data) {
    return validate(data, {
      name: (value) => validators.name(value, 'name'),
      description: (value) => validators.string(value, 'description', 10, 1000),
      price: validators.price
    });
  },

  // Login validation
  login(data) {
    return validate(data, {
      email: validators.email,
      password: (value) => {
        if (!value) {
          throw new ValidationError('Password is required', 'password');
        }
        return value;
      }
    });
  }
};