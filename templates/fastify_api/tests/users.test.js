/**
 * 👤 User API Tests for Fastify Vibecoding
 * 
 * Comprehensive tests for the user endpoints.
 * Perfect for TDD and vibecoding demonstrations.
 */

import { test, describe, beforeAll, afterAll, beforeEach } from 'vitest';
import { build } from '../src/app.js';

describe('User API Endpoints', () => {
  let app;
  let userToken;
  let testUser;

  beforeAll(async () => {
    app = build({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up test data (in a real app, you'd use a test database)
    // For vibecoding demos, we'll work with the data as-is
  });

  describe('POST /api/users/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
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
      const result = JSON.parse(response.payload);
      expect(result.username).toBe(userData.username);
      expect(result.email).toBe(userData.email);
      expect(result.name).toBe(userData.name);
      expect(result.password).toBeUndefined(); // Password should not be returned
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
      const result = JSON.parse(response.payload);
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
      const userData = {
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
      const response = await app.inject({
        method: 'POST',
        url: '/api/users/login',
        payload: {
          email: userData.email,
          password: userData.password
        }
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.expiresIn).toBe('1d');
      expect(result.user.password).toBeUndefined();

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
      const result = JSON.parse(response.payload);
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
      const result = JSON.parse(response.payload);
      expect(result.users).toBeInstanceOf(Array);
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
      const result = JSON.parse(response.payload);
      expect(result.users).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/users/:id', () => {
    test('should get user by id', async () => {
      if (!testUser) {
        // Create a test user first
        const userData = {
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
        testUser = JSON.parse(createResponse.payload);
      }

      const response = await app.inject({
        method: 'GET',
        url: `/api/users/${testUser.id}`
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
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
        const userData = {
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

        userToken = JSON.parse(loginResponse.payload).token;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/api/users/me',
        headers: {
          authorization: `Bearer ${userToken}`
        }
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.id).toBeDefined();
      expect(result.email).toBeDefined();
      expect(result.password).toBeUndefined();
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
      const result = JSON.parse(response.payload);
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
      const result = JSON.parse(response.payload);
      expect(typeof result.exists).toBe('boolean');
    });

    test('should get user stats', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users/stats'
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.total).toBeDefined();
      expect(result.recent).toBeDefined();
      expect(result.growth).toBeDefined();
    });
  });
});