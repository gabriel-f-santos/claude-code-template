# 📋 Fastify + Prisma PRP Template

## Meta Information
- **Feature Name**: `{FEATURE_NAME}`
- **Priority**: `{PRIORITY}`
- **Estimated Time**: `{DURATION}`
- **Architecture**: Fastify + TypeScript + Prisma + SQLite + JSON Schema

## Purpose
{FEATURE_DESCRIPTION}

## Core Principles
1. **Type Safety**: Full TypeScript coverage with strict configuration
2. **Fastify Performance**: High-performance HTTP server with type-safe schemas
3. **Prisma ORM**: Type-safe database operations with automated migrations
4. **JSON Schema Validation**: Runtime validation with compile-time type inference
5. **RESTful API Design**: Clean, predictable API endpoints

---

## Goal
{DETAILED_GOAL}

## Why
{BUSINESS_JUSTIFICATION}

## What
{SPECIFIC_DELIVERABLES}

### Success Criteria
- [ ] All API endpoints working with proper HTTP status codes
- [ ] >90% test coverage with Vitest
- [ ] Database schema properly designed with Prisma
- [ ] Response times <200ms for all endpoints
- [ ] Type safety with zero TypeScript errors
- [ ] API documentation auto-generated

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- file: CLAUDE.md
  why: Fastify + Prisma architecture patterns and conventions
  
- file: MULTI_AGENT_PLAN.md  
  why: Current development plan and coordination
```

### Visual References
```yaml
# API DESIGN REFERENCES (if applicable)
- directory: PRPs/{FEATURE_NAME}/images/
  contents:
    - api/endpoints-diagram.png     # API structure and relationships
    - api/data-flow.png            # Request/response flow
    - database/schema-diagram.png   # Prisma schema visual
  why: Visual guidance for API and database design
```

### Current Project Structure
```bash
# Fastify + Prisma + TypeScript project structure
src/
├── controllers/                # Route handlers
│   ├── {entity}.controller.ts  # {Entity} CRUD operations
│   └── health.controller.ts    # Health check endpoint
├── schemas/                    # JSON Schema definitions
│   ├── {entity}.schema.ts      # {Entity} validation schemas
│   └── common.schema.ts        # Shared schemas
├── services/                   # Business logic layer
│   ├── {entity}.service.ts     # {Entity} business operations
│   └── database.service.ts     # Database connection service
├── types/                      # TypeScript type definitions
│   ├── {entity}.types.ts       # {Entity} related types
│   └── api.types.ts            # API request/response types
├── utils/                      # Utility functions
│   ├── validation.ts           # Custom validators
│   ├── errors.ts              # Error handling utilities
│   └── logger.ts              # Logging configuration
├── plugins/                    # Fastify plugins
│   ├── prisma.plugin.ts       # Prisma plugin
│   └── cors.plugin.ts         # CORS configuration
├── routes/                     # Route definitions
│   ├── {entity}.routes.ts      # {Entity} routes
│   └── index.routes.ts         # Route registration
├── app.ts                      # Fastify app setup
└── server.ts                   # Server entry point
├── prisma/
│   ├── schema.prisma           # Prisma schema definition
│   ├── migrations/             # Database migrations
│   └── seed.ts                 # Database seeding
├── tests/                      # Test files
│   ├── controllers/            # Controller tests
│   ├── services/              # Service tests
│   └── integration/           # Integration tests
├── package.json
├── tsconfig.json
└── .env.example
```

### Technology Stack Context
```yaml
# Fastify Stack Specifics
Backend Framework: Fastify 4.24+
Language: TypeScript 5.2+
Database ORM: Prisma 5.6+
Database: SQLite (development) / PostgreSQL (production)
Validation: JSON Schema with Ajv
Testing: Vitest + Supertest
HTTP Client: Undici (built-in Fastify)
Logging: Pino (built-in Fastify)
Process Manager: PM2 (production)
API Docs: Fastify Swagger (OpenAPI 3.0)
```

## Implementation Blueprint

### Prisma Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model {Entity} {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  description String?
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Optional relationships
  // userId      Int      @map("user_id")
  // user        User     @relation(fields: [userId], references: [id])
  
  @@map("{entities}")
}
```

### TypeScript Types
```typescript
// src/types/{entity}.types.ts
import { Prisma } from '@prisma/client'

// Prisma generated types
export type {Entity} = Prisma.{Entity}
export type {Entity}CreateInput = Prisma.{Entity}CreateInput
export type {Entity}UpdateInput = Prisma.{Entity}UpdateInput
export type {Entity}WhereInput = Prisma.{Entity}WhereInput

// API request/response types
export interface Create{Entity}Request {
  name: string
  description?: string
  isActive?: boolean
}

export interface Update{Entity}Request {
  name?: string
  description?: string
  isActive?: boolean
}

export interface {Entity}Response {
  id: number
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface {Entity}ListResponse {
  data: {Entity}Response[]
  total: number
  page: number
  limit: number
}

export interface {Entity}QueryParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
  sortBy?: 'name' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}
```

### JSON Schema Validation
```typescript
// src/schemas/{entity}.schema.ts
import { Type, Static } from '@sinclair/typebox'

// Request schemas
export const Create{Entity}Schema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 100 }),
  description: Type.Optional(Type.String({ maxLength: 500 })),
  isActive: Type.Optional(Type.Boolean({ default: true }))
})

export const Update{Entity}Schema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  description: Type.Optional(Type.String({ maxLength: 500 })),
  isActive: Type.Optional(Type.Boolean())
})

export const {Entity}ParamsSchema = Type.Object({
  id: Type.String({ pattern: '^[0-9]+$' })
})

export const {Entity}QuerySchema = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 10 })),
  search: Type.Optional(Type.String()),
  isActive: Type.Optional(Type.Boolean()),
  sortBy: Type.Optional(Type.Union([
    Type.Literal('name'),
    Type.Literal('createdAt'),
    Type.Literal('updatedAt')
  ], { default: 'createdAt' })),
  sortOrder: Type.Optional(Type.Union([
    Type.Literal('asc'),
    Type.Literal('desc')
  ], { default: 'desc' }))
})

// Response schemas
export const {Entity}ResponseSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  isActive: Type.Boolean(),
  createdAt: Type.String(),
  updatedAt: Type.String()
})

export const {Entity}ListResponseSchema = Type.Object({
  data: Type.Array({Entity}ResponseSchema),
  total: Type.Number(),
  page: Type.Number(),
  limit: Type.Number()
})

// Type inference
export type Create{Entity}Request = Static<typeof Create{Entity}Schema>
export type Update{Entity}Request = Static<typeof Update{Entity}Schema>
export type {Entity}Params = Static<typeof {Entity}ParamsSchema>
export type {Entity}Query = Static<typeof {Entity}QuerySchema>
export type {Entity}Response = Static<typeof {Entity}ResponseSchema>
export type {Entity}ListResponse = Static<typeof {Entity}ListResponseSchema>
```

### Service Layer
```typescript
// src/services/{entity}.service.ts
import { PrismaClient } from '@prisma/client'
import { Create{Entity}Request, Update{Entity}Request, {Entity}QueryParams } from '../types/{entity}.types'

export class {Entity}Service {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Create{Entity}Request) {
    try {
      const {entity} = await this.prisma.{entity}.create({
        data: {
          name: data.name,
          description: data.description,
          isActive: data.isActive ?? true
        }
      })
      
      return this.format{Entity}({entity})
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('{Entity} with this name already exists')
      }
      throw error
    }
  }

  async findMany(params: {Entity}QueryParams = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params

    const skip = (page - 1) * limit
    
    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(isActive !== undefined && { isActive })
    }

    const [{entities}, total] = await Promise.all([
      this.prisma.{entity}.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      this.prisma.{entity}.count({ where })
    ])

    return {
      data: {entities}.map(this.format{Entity}),
      total,
      page,
      limit
    }
  }

  async findById(id: number) {
    const {entity} = await this.prisma.{entity}.findUnique({
      where: { id }
    })

    if (!{entity}) {
      throw new Error('{Entity} not found')
    }

    return this.format{Entity}({entity})
  }

  async update(id: number, data: Update{Entity}Request) {
    try {
      const {entity} = await this.prisma.{entity}.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.isActive !== undefined && { isActive: data.isActive })
        }
      })
      
      return this.format{Entity}({entity})
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('{Entity} not found')
      }
      if (error.code === 'P2002') {
        throw new Error('{Entity} with this name already exists')
      }
      throw error
    }
  }

  async delete(id: number) {
    try {
      await this.prisma.{entity}.delete({
        where: { id }
      })
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('{Entity} not found')
      }
      throw error
    }
  }

  private format{Entity}({entity}: { id: number, name: string, description: string | null, isActive: boolean, createdAt: Date, updatedAt: Date }) {
    return {
      id: {entity}.id,
      name: {entity}.name,
      description: {entity}.description,
      isActive: {entity}.isActive,
      createdAt: {entity}.createdAt.toISOString(),
      updatedAt: {entity}.updatedAt.toISOString()
    }
  }
}
```

### Controller (Route Handler)
```typescript
// src/controllers/{entity}.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { {Entity}Service } from '../services/{entity}.service'
import {
  Create{Entity}Request,
  Update{Entity}Request,
  {Entity}Params,
  {Entity}Query
} from '../schemas/{entity}.schema'

export class {Entity}Controller {
  constructor(private readonly {entity}Service: {Entity}Service) {}

  create = async (
    request: FastifyRequest<{ Body: Create{Entity}Request }>,
    reply: FastifyReply
  ) => {
    try {
      const {entity} = await this.{entity}Service.create(request.body)
      reply.code(201).send({entity})
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error'
      
      if (message.includes('already exists')) {
        reply.code(409).send({ 
          error: 'Conflict',
          message 
        })
      } else {
        reply.code(500).send({
          error: 'Internal Server Error',
          message
        })
      }
    }
  }

  findMany = async (
    request: FastifyRequest<{ Querystring: {Entity}Query }>,
    reply: FastifyReply
  ) => {
    try {
      const result = await this.{entity}Service.findMany(request.query)
      reply.send(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error'
      reply.code(500).send({
        error: 'Internal Server Error',
        message
      })
    }
  }

  findById = async (
    request: FastifyRequest<{ Params: {Entity}Params }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id, 10)
      const {entity} = await this.{entity}Service.findById(id)
      reply.send({entity})
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error'
      
      if (message.includes('not found')) {
        reply.code(404).send({
          error: 'Not Found',
          message
        })
      } else {
        reply.code(500).send({
          error: 'Internal Server Error',
          message
        })
      }
    }
  }

  update = async (
    request: FastifyRequest<{ Params: {Entity}Params, Body: Update{Entity}Request }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id, 10)
      const {entity} = await this.{entity}Service.update(id, request.body)
      reply.send({entity})
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error'
      
      if (message.includes('not found')) {
        reply.code(404).send({
          error: 'Not Found',
          message
        })
      } else if (message.includes('already exists')) {
        reply.code(409).send({
          error: 'Conflict',
          message
        })
      } else {
        reply.code(500).send({
          error: 'Internal Server Error',
          message
        })
      }
    }
  }

  delete = async (
    request: FastifyRequest<{ Params: {Entity}Params }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id, 10)
      await this.{entity}Service.delete(id)
      reply.code(204).send()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error'
      
      if (message.includes('not found')) {
        reply.code(404).send({
          error: 'Not Found',
          message
        })
      } else {
        reply.code(500).send({
          error: 'Internal Server Error',
          message
        })
      }
    }
  }
}
```

### Fastify Routes
```typescript
// src/routes/{entity}.routes.ts
import { FastifyInstance } from 'fastify'
import { {Entity}Controller } from '../controllers/{entity}.controller'
import { {Entity}Service } from '../services/{entity}.service'
import {
  Create{Entity}Schema,
  Update{Entity}Schema,
  {Entity}ParamsSchema,
  {Entity}QuerySchema,
  {Entity}ResponseSchema,
  {Entity}ListResponseSchema
} from '../schemas/{entity}.schema'

export default async function {entity}Routes(fastify: FastifyInstance) {
  const {entity}Service = new {Entity}Service(fastify.prisma)
  const {entity}Controller = new {Entity}Controller({entity}Service)

  // Create {entity}
  fastify.post('/{entities}', {
    schema: {
      body: Create{Entity}Schema,
      response: {
        201: {
          type: 'object',
          properties: {
            {entity}: {Entity}ResponseSchema
          }
        },
        409: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      },
      tags: ['{entities}'],
      summary: 'Create a new {entity}',
      description: 'Creates a new {entity} with the provided data'
    }
  }, {entity}Controller.create)

  // Get all {entities}
  fastify.get('/{entities}', {
    schema: {
      querystring: {Entity}QuerySchema,
      response: {
        200: {Entity}ListResponseSchema
      },
      tags: ['{entities}'],
      summary: 'Get all {entities}',
      description: 'Retrieves a list of {entities} with pagination and filtering'
    }
  }, {entity}Controller.findMany)

  // Get {entity} by ID
  fastify.get('/{entities}/:id', {
    schema: {
      params: {Entity}ParamsSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            {entity}: {Entity}ResponseSchema
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      },
      tags: ['{entities}'],
      summary: 'Get {entity} by ID',
      description: 'Retrieves a specific {entity} by its ID'
    }
  }, {entity}Controller.findById)

  // Update {entity}
  fastify.put('/{entities}/:id', {
    schema: {
      params: {Entity}ParamsSchema,
      body: Update{Entity}Schema,
      response: {
        200: {
          type: 'object',
          properties: {
            {entity}: {Entity}ResponseSchema
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        409: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      },
      tags: ['{entities}'],
      summary: 'Update {entity}',
      description: 'Updates an existing {entity} with the provided data'
    }
  }, {entity}Controller.update)

  // Delete {entity}
  fastify.delete('/{entities}/:id', {
    schema: {
      params: {Entity}ParamsSchema,
      response: {
        204: {
          type: 'null'
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      },
      tags: ['{entities}'],
      summary: 'Delete {entity}',
      description: 'Deletes an existing {entity}'
    }
  }, {entity}Controller.delete)
}
```

### Prisma Plugin
```typescript
// src/plugins/prisma.plugin.ts
import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

export default fp(async function (fastify: FastifyInstance) {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  })

  await prisma.$connect()

  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async (fastify) => {
    await fastify.prisma.$disconnect()
  })
})
```

## Task Breakdown

### Phase 1: Database Schema (DatabaseArchitect)
- [ ] Design Prisma schema with proper relationships and constraints
- [ ] Create database migration files
- [ ] Set up database seeding for development data
- [ ] **Quality Gate**: Schema migrated successfully, relationships working

### Phase 2: Backend Implementation (BackendEngineer)
- [ ] Implement TypeScript types and JSON schemas
- [ ] Create service layer with business logic
- [ ] Build controllers with proper error handling
- [ ] Set up Fastify routes with validation
- [ ] Integrate Prisma client with proper error handling
- [ ] **Quality Gate**: All endpoints working, >90% test coverage, <200ms response

### Phase 3: Testing & Quality (QAEngineer)
- [ ] Write comprehensive Vitest test suite
- [ ] Test all API endpoints with different scenarios
- [ ] Test database operations and constraints
- [ ] Test validation schemas and error cases
- [ ] Performance testing for response times
- [ ] **Quality Gate**: All tests passing, coverage >90%

### Phase 4: Integration & Documentation (IntegrationExpert)
- [ ] Set up OpenAPI documentation with Fastify Swagger
- [ ] Test end-to-end API workflows
- [ ] Validate database migrations and rollbacks
- [ ] Performance testing under load
- [ ] **Quality Gate**: Complete integration working, docs accurate

## Validation Commands

### Database Operations
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

### Development Server
```bash
# Start development server with hot reload
npm run dev

# Start production server
npm run start

# Check TypeScript compilation
npm run type-check
```

### Testing
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

### API Documentation
```bash
# Start server and view docs at http://localhost:3000/docs
npm run dev
```

## Quality Gates

### Database Quality Gates
- [ ] Prisma schema properly defined with relationships
- [ ] Database migrations created and tested
- [ ] Database constraints and indexes optimized
- [ ] Migration rollback tested successfully
- [ ] Seeding data working for development

### Backend Quality Gates  
- [ ] All CRUD endpoints implemented and working
- [ ] JSON Schema validation working correctly
- [ ] TypeScript types properly defined and inferred
- [ ] Error handling with proper HTTP status codes
- [ ] Response times <200ms for all endpoints
- [ ] >90% test coverage with Vitest

### API Quality Gates
- [ ] OpenAPI documentation auto-generated and accurate
- [ ] RESTful API design principles followed
- [ ] Proper pagination implemented
- [ ] Request/response validation working correctly
- [ ] CORS configured properly (if needed)
- [ ] Rate limiting configured (if needed)

### Type Safety Quality Gates
- [ ] Zero TypeScript compilation errors
- [ ] Proper type inference from JSON schemas
- [ ] Database operations type-safe with Prisma
- [ ] Request/response types properly validated
- [ ] No use of `any` types (except for necessary third-party)

## Anti-Patterns to Avoid
- ❌ Don't skip JSON Schema validation on API endpoints
- ❌ Don't use `any` types instead of proper TypeScript types
- ❌ Don't skip database migrations for schema changes
- ❌ Don't ignore proper HTTP status codes in responses
- ❌ Don't skip error handling in controllers
- ❌ Don't hardcode database queries (use Prisma client)
- ❌ Don't skip request validation and sanitization

## Final Validation Checklist
- [ ] All API endpoints working correctly with proper validation
- [ ] Database schema properly designed and migrated
- [ ] >90% test coverage achieved
- [ ] Type safety with zero TypeScript errors
- [ ] Performance requirements met (<200ms)
- [ ] OpenAPI documentation complete and accurate
- [ ] Error handling comprehensive across all layers
- [ ] Ready for production deployment

---

## Notes
- Use TypeScript strict mode for maximum type safety
- Leverage Prisma's type generation for database operations
- Follow Fastify best practices for plugin architecture
- Implement proper logging with Pino for debugging
- Consider adding rate limiting for production deployment
- Use environment variables for configuration management