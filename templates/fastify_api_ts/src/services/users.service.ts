/**
 * 👤 User Service for Fastify TypeScript Vibecoding
 * 
 * Type-safe business logic for user operations.
 * Clean, testable, and perfect for rapid development.
 */

import bcrypt from 'bcryptjs';
import type { PrismaClient, User } from '@prisma/client';
import { 
  NotFoundError, 
  UnauthorizedError,
  handleDatabaseError,
  validatePagination 
} from '@/utils/error-handler.js';
import { quickValidation } from '@/utils/validators.js';
import type {
  IUserService,
  UserCreateRequest,
  UserUpdateRequest,
  UserResponse,
  PaginationQuery,
  PaginatedUsersResponse
} from '@/types/index.js';

export class UsersService implements IUserService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Get all users with pagination and search
   */
  async getUsers(query: PaginationQuery = {}): Promise<PaginatedUsersResponse> {
    const { page, limit, skip } = validatePagination(query);
    const { search } = query;

    // Build where clause for search
    const where = search ? {
      OR: [
        { username: { contains: search, mode: 'insensitive' as const } },
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    try {
      // Get users and total count in parallel - vibecoding efficiency!
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            username: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true
            // Note: password is excluded from select
          }
        }),
        this.prisma.user.count({ where })
      ]);

      const pages = Math.ceil(total / limit);

      return {
        users: users as UserResponse[],
        pagination: {
          page,
          limit,
          total,
          pages
        }
      };
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<UserResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        throw new NotFoundError('User');
      }

      return user as UserResponse;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      handleDatabaseError(error);
    }
  }

  /**
   * Get user by email (for login)
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email }
      });

      return user;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Create new user
   */
  async createUser(userData: UserCreateRequest): Promise<UserResponse> {
    // Validate input data
    const validatedData = quickValidation.createUser(userData);

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    try {
      const user = await this.prisma.user.create({
        data: {
          ...validatedData,
          password: hashedPassword
        },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return user as UserResponse;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Update user
   */
  async updateUser(id: number, userData: UserUpdateRequest): Promise<UserResponse> {
    // Validate input data
    const validatedData = quickValidation.updateUser(userData);

    // Check if there's anything to update
    if (Object.keys(validatedData).length === 0) {
      return await this.getUserById(id);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: validatedData,
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return user as UserResponse;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id }
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Authenticate user (for login)
   */
  async authenticateUser(email: string, password: string): Promise<UserResponse> {
    // Get user with password
    const user = await this.getUserByEmail(email);
    
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as UserResponse;
  }

  /**
   * Check if username exists
   */
  async usernameExists(username: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
        select: { id: true }
      });
      return !!user;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true }
      });
      return !!user;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Get user stats (for admin dashboards)
   */
  async getUserStats(): Promise<{
    total: number;
    recent: number;
    growth: string;
  }> {
    try {
      const [total, recentCount] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        })
      ]);

      return {
        total,
        recent: recentCount,
        growth: total > 0 ? ((recentCount / total) * 100).toFixed(1) : '0'
      };
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}