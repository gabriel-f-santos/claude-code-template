/**
 * 👤 User API Tests for Fastify TypeScript Vibecoding
 * 
 * Comprehensive type-safe tests for the user endpoints.
 * Perfect for TDD and vibecoding demonstrations.
 */

import { test, describe, beforeAll, afterAll, expect } from 'vitest';
import { app } from '../src/app.js';
import type { 
  UserCreateRequest, 
  UserLoginRequest, 
  UserResponse, 
  LoginResponse,
  PaginatedUsersResponse
} from '../src/types/index.js';

describe('User API Endpoints', () => {
  let userToken: string;
  let testUser: UserResponse;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/users/register', () => {
    test('should register a new user successfully', async () => {
      const userData: UserCreateRequest = {
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/users/register',
        payload: userData
      });

      expect(response.statusCode).toBe(201);
      
      const result = response.json<UserResponse>();
      expect(result.username).toBe(userData.username);
      expect(result.email).toBe(userData.email);
      expect(result.name).toBe(userData.name);
      expect('password' in result).toBe(false); // Password should not be returned
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();

      // Store for later tests
      testUser = result;
    });

    test('should validate required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/users/register',
        payload: {
          username: 'test'
          // Missing required fields
        }
      });

      expect(response.statusCode).toBe(400);
      const result = response.json();
      expect(result.error).toBe(true);
    });

    test('should validate email format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/users/register',
        payload: {
          username: 'testuser2',
          email: 'invalid-email',
          name: 'Test User',
          password: 'password123'
        }
      });

      expect(response.statusCode).toBe(400);
    });

    test('should validate password strength', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/users/register',
        payload: {
          username: 'testuser3',
          email: 'test3@example.com',
          name: 'Test User',
          password: '123' // Too short
        }
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /api/users/login', () => {
    test('should login with valid credentials', async () => {
      // First register a user
      const userData: UserCreateRequest = {
        username: 'loginuser',
        email: 'login@example.com',
        name: 'Login User',
        password: 'password123'
      };

      await app.inject({
        method: 'POST',
        url: '/api/users/register',
        payload: userData
      });

      // Then login
      const loginData: UserLoginRequest = {
        email: userData.email,
        password: userData.password
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/users/login',
        payload: loginData
      });

      expect(response.statusCode).toBe(200);
      
      const result = response.json<LoginResponse>();
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.expiresIn).toBe('1d');
      expect('password' in result.user).toBe(false);

      // Store token for authenticated tests
      userToken = result.token;
    });

    test('should reject invalid credentials', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/users/login',
        payload: {
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        }
      });

      expect(response.statusCode).toBe(401);
      const result = response.json();
      expect(result.error).toBe(true);
      expect(result.message).toContain('Invalid credentials');
    });
  });

  describe('GET /api/users', () => {
    test('should get users with pagination', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users?page=1&limit=10'
      });

      expect(response.statusCode).toBe(200);
      
      const result = response.json<PaginatedUsersResponse>();
      expect(Array.isArray(result.users)).toBe(true);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    test('should search users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users?search=test'
      });

      expect(response.statusCode).toBe(200);
      
      const result = response.json<PaginatedUsersResponse>();
      expect(Array.isArray(result.users)).toBe(true);
    });
  });

  describe('GET /api/users/:id', () => {
    test('should get user by id', async () => {
      if (!testUser) {
        // Create a test user first
        const userData: UserCreateRequest = {
          username: 'getusertest',
          email: 'getuser@example.com',
          name: 'Get User Test',
          password: 'password123'
        };

        const createResponse = await app.inject({
          method: 'POST',
          url: '/api/users/register',
          payload: userData
        });
        
        testUser = createResponse.json<UserResponse>();
      }

      const response = await app.inject({
        method: 'GET',
        url: `/api/users/${testUser.id}`
      });

      expect(response.statusCode).toBe(200);
      
      const result = response.json<UserResponse>();
      expect(result.id).toBe(testUser.id);
      expect(result.username).toBe(testUser.username);
    });

    test('should return 404 for non-existent user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users/99999'
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /api/users/me', () => {
    test('should get current user profile with valid token', async () => {
      if (!userToken) {
        // Create and login a user first
        const userData: UserCreateRequest = {
          username: 'meuser',
          email: 'me@example.com',
          name: 'Me User',
          password: 'password123'
        };

        await app.inject({
          method: 'POST',
          url: '/api/users/register',
          payload: userData
        });

        const loginResponse = await app.inject({
          method: 'POST',
          url: '/api/users/login',
          payload: {
            email: userData.email,
            password: userData.password
          }
        });

        userToken = loginResponse.json<LoginResponse>().token;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/api/users/me',
        headers: {
          authorization: `Bearer ${userToken}`
        }
      });

      expect(response.statusCode).toBe(200);
      
      const result = response.json<UserResponse>();
      expect(result.id).toBeDefined();
      expect(result.email).toBeDefined();
      expect('password' in result).toBe(false);
    });

    test('should return 401 without token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users/me'
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('Utility endpoints', () => {
    test('should check if email exists', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/users/check-email',
        payload: {
          email: 'test@example.com'
        }
      });

      expect(response.statusCode).toBe(200);
      
      const result = response.json<{ exists: boolean }>();
      expect(typeof result.exists).toBe('boolean');
    });

    test('should check if username exists', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/users/check-username',
        payload: {
          username: 'testuser'
        }
      });

      expect(response.statusCode).toBe(200);
      
      const result = response.json<{ exists: boolean }>();
      expect(typeof result.exists).toBe('boolean');
    });

    test('should get user stats', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users/stats'
      });

      expect(response.statusCode).toBe(200);
      
      const result = response.json<{
        total: number;
        recent: number;
        growth: string;
      }>();
      
      expect(result.total).toBeDefined();
      expect(result.recent).toBeDefined();
      expect(result.growth).toBeDefined();
    });
  });
});