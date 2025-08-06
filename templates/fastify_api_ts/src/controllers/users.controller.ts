/**
 * 👤 User Controller for Fastify TypeScript Vibecoding
 * 
 * Type-safe controller layer that handles HTTP requests and responses.
 * Perfect for rapid CRUD development and live coding sessions.
 */

import { UsersService } from '@/services/users.service.js';
import { asyncHandler } from '@/utils/error-handler.js';
import { quickValidation } from '@/utils/validators.js';
import type {
  FastifyInstanceWithDecorators,
  RouteHandler,
  AuthenticatedRouteHandler,
  UserCreateRequest,
  UserUpdateRequest,
  UserLoginRequest,
  PaginationQuery,
  IdParam
} from '@/types/index.js';

export class UsersController {
  private readonly usersService: UsersService;
  private readonly fastify: FastifyInstanceWithDecorators;

  constructor(fastify: FastifyInstanceWithDecorators) {
    this.usersService = new UsersService(fastify.prisma);
    this.fastify = fastify;
  }

  /**
   * GET /users - Get all users with pagination
   */
  public getUsers: RouteHandler<PaginationQuery> = asyncHandler(async (request, reply) => {
    const result = await this.usersService.getUsers(request.query);
    reply.send(result);
  });

  /**
   * GET /users/:id - Get user by ID
   */
  public getUserById: RouteHandler<unknown, IdParam> = asyncHandler(async (request, reply) => {
    const { id } = request.params;
    const userId = parseInt(id);
    
    const user = await this.usersService.getUserById(userId);
    reply.send(user);
  });

  /**
   * POST /users/register - Register new user
   */
  public createUser: RouteHandler<unknown, unknown, UserCreateRequest> = asyncHandler(async (request, reply) => {
    const user = await this.usersService.createUser(request.body);
    reply.code(201).send(user);
  });

  /**
   * POST /users/login - User login
   */
  public loginUser: RouteHandler<unknown, unknown, UserLoginRequest> = asyncHandler(async (request, reply) => {
    // Validate login data
    const { email, password } = quickValidation.login(request.body);

    // Authenticate user
    const user = await this.usersService.authenticateUser(email, password);
    
    // Generate JWT token
    const token = this.fastify.generateToken({ 
      id: user.id, 
      email: user.email 
    });

    reply.send({
      user,
      token,
      expiresIn: '1d'
    });
  });

  /**
   * PUT /users/:id - Update user
   */
  public updateUser: RouteHandler<unknown, IdParam, UserUpdateRequest> = asyncHandler(async (request, reply) => {
    const { id } = request.params;
    const userId = parseInt(id);
    
    const user = await this.usersService.updateUser(userId, request.body);
    reply.send(user);
  });

  /**
   * DELETE /users/:id - Delete user
   */
  public deleteUser: RouteHandler<unknown, IdParam> = asyncHandler(async (request, reply) => {
    const { id } = request.params;
    const userId = parseInt(id);
    
    await this.usersService.deleteUser(userId);
    reply.code(204).send();
  });

  /**
   * GET /users/me - Get current user profile (requires auth)
   */
  public getCurrentUser: AuthenticatedRouteHandler = asyncHandler(async (request, reply) => {
    const user = await this.usersService.getUserById(request.user.id);
    reply.send(user);
  });

  /**
   * GET /users/stats - Get user statistics (for dashboards)
   */
  public getUserStats: RouteHandler = asyncHandler(async (request, reply) => {
    const stats = await this.usersService.getUserStats();
    reply.send(stats);
  });

  /**
   * POST /users/check-email - Check if email exists
   */
  public checkEmail: RouteHandler<unknown, unknown, { email: string }> = asyncHandler(async (request, reply) => {
    const { email } = request.body;
    const exists = await this.usersService.emailExists(email);
    reply.send({ exists });
  });

  /**
   * POST /users/check-username - Check if username exists
   */
  public checkUsername: RouteHandler<unknown, unknown, { username: string }> = asyncHandler(async (request, reply) => {
    const { username } = request.body;
    const exists = await this.usersService.usernameExists(username);
    reply.send({ exists });
  });
}