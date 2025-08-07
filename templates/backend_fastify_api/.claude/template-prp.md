# 📋 Fastify + Prisma JavaScript PRP Template

## Meta Information
- **Feature Name**: `{FEATURE_NAME}`
- **Priority**: `{PRIORITY}`
- **Estimated Time**: `{DURATION}`
- **Architecture**: Fastify + Prisma + SQLite/PostgreSQL + JWT

## Purpose
{FEATURE_DESCRIPTION}

## Core Principles
1. **Fastify Performance**: High-performance Node.js server, response time <200ms
2. **Prisma Best Practices**: Type-safe database operations, auto-generated client
3. **Security First**: JWT tokens, input validation, schema validation
4. **Test Coverage**: >90% coverage with Vitest
5. **API Design**: RESTful endpoints with proper HTTP status codes

---

## Goal
{DETAILED_GOAL}

## Why
{BUSINESS_JUSTIFICATION}

## What
{SPECIFIC_DELIVERABLES}

### Success Criteria
- [ ] All API endpoints working with proper status codes
- [ ] >90% test coverage with Vitest
- [ ] Database schema properly designed with Prisma
- [ ] Response times <200ms for all endpoints
- [ ] Security validations passing
- [ ] OpenAPI docs auto-generated with @fastify/swagger

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
    - database/schema-diagram.png   # Prisma schema design
  why: Visual guidance for API and database design
```

### Current Project Structure
```bash
# Fastify + Prisma JavaScript project structure
backend/
├── src/
│   ├── app.js                  # Fastify app instance
│   ├── controllers/
│   │   ├── {entity}.controller.js # Route handlers
│   │   └── users.controller.js    # Example controller
│   ├── plugins/
│   │   ├── auth.js            # JWT authentication plugin
│   │   └── db.js              # Prisma database plugin
│   ├── routes/
│   │   ├── {entity}.routes.js # Route definitions
│   │   └── users.routes.js    # Example routes
│   ├── schemas/
│   │   ├── {entity}.schema.js # JSON Schema validation
│   │   └── users.schema.js    # Example schemas
│   ├── services/
│   │   ├── {entity}.service.js # Business logic
│   │   └── users.service.js   # Example service
│   └── utils/
│       ├── error-handler.js   # Error handling utilities
│       └── validators.js      # Custom validators
├── prisma/
│   ├── schema.prisma          # Prisma database schema
│   └── migrations/            # Database migrations
├── tests/
│   ├── {entity}.test.js       # Feature tests
│   └── users.test.js          # Example tests
├── package.json
├── vitest.config.js
└── .env.example
```

### Technology Stack Context
```yaml
# Fastify + Prisma JavaScript Stack Specifics
Backend Framework: Fastify 4.0+
Database ORM: Prisma 5.0+
Database: SQLite (dev) / PostgreSQL (prod)
Authentication: JWT with @fastify/jwt
Validation: JSON Schema + Ajv
Testing: Vitest + @fastify/test-helper
API Docs: @fastify/swagger + @fastify/swagger-ui
HTTP Client: @fastify/test-helper (for tests)
Runtime: Node.js 18+
```

## Implementation Blueprint

### Prisma Database Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // or "postgresql"
  url      = env("DATABASE_URL")
}

model {Entity} {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  description String?
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // Relationships
  // userId      Int      @map("user_id")
  // user        User     @relation(fields: [userId], references: [id])
  // items       Item[]
  
  @@map("{entities}")
  @@index([name])
  @@index([isActive, userId])
}
```

### JSON Schema Validation
```javascript
// src/schemas/{entity}.schema.js

const {entity}CreateSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 100
    },
    description: {
      type: 'string',
      maxLength: 1000
    },
    isActive: {
      type: 'boolean',
      default: true
    }
  },
  additionalProperties: false
}

const {entity}UpdateSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 100
    },
    description: {
      type: 'string',
      maxLength: 1000
    },
    isActive: {
      type: 'boolean'
    }
  },
  additionalProperties: false
}

const {entity}ResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    description: { type: 'string' },
    isActive: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
}

const {entity}ListSchema = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {entity}ResponseSchema
    },
    total: { type: 'integer' },
    page: { type: 'integer' },
    size: { type: 'integer' }
  }
}

module.exports = {
  {entity}CreateSchema,
  {entity}UpdateSchema,
  {entity}ResponseSchema,
  {entity}ListSchema
}
```

### Service Layer
```javascript
// src/services/{entity}.service.js

class {Entity}Service {
  constructor(prisma) {
    this.prisma = prisma
  }

  async create({entity}Data, userId) {
    try {
      // Check if entity with same name exists for user
      const existing = await this.prisma.{entity}.findFirst({
        where: {
          name: {entity}Data.name,
          userId
        }
      })

      if (existing) {
        throw new Error('{Entity} with this name already exists')
      }

      return await this.prisma.{entity}.create({
        data: {
          ...{entity}Data,
          userId
        }
      })
    } catch (error) {
      throw new Error(`Failed to create {entity}: ${error.message}`)
    }
  }

  async findMany(userId, { skip = 0, take = 100, search } = {}) {
    const where = {
      userId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    const [items, total] = await Promise.all([
      this.prisma.{entity}.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          // Include related data if needed
          // user: { select: { id: true, username: true } }
        }
      }),
      this.prisma.{entity}.count({ where })
    ])

    return { items, total }
  }

  async findById({entity}Id, userId) {
    return await this.prisma.{entity}.findFirst({
      where: {
        id: {entity}Id,
        userId
      },
      include: {
        // Include related data if needed
        // user: { select: { id: true, username: true } }
      }
    })
  }

  async update({entity}Id, updateData, userId) {
    try {
      // Check if entity exists and belongs to user
      const existing = await this.findById({entity}Id, userId)
      if (!existing) {
        return null
      }

      // Check for name conflicts if name is being updated
      if (updateData.name && updateData.name !== existing.name) {
        const nameConflict = await this.prisma.{entity}.findFirst({
          where: {
            name: updateData.name,
            userId,
            id: { not: {entity}Id }
          }
        })

        if (nameConflict) {
          throw new Error('{Entity} with this name already exists')
        }
      }

      return await this.prisma.{entity}.update({
        where: { id: {entity}Id },
        data: updateData
      })
    } catch (error) {
      throw new Error(`Failed to update {entity}: ${error.message}`)
    }
  }

  async delete({entity}Id, userId) {
    try {
      // Check if entity exists and belongs to user
      const existing = await this.findById({entity}Id, userId)
      if (!existing) {
        return false
      }

      await this.prisma.{entity}.delete({
        where: { id: {entity}Id }
      })

      return true
    } catch (error) {
      throw new Error(`Failed to delete {entity}: ${error.message}`)
    }
  }

  async count(userId, search) {
    const where = {
      userId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    return await this.prisma.{entity}.count({ where })
  }
}

module.exports = {Entity}Service
```

### Controller Layer
```javascript
// src/controllers/{entity}.controller.js
const {Entity}Service = require('../services/{entity}.service')

class {Entity}Controller {
  constructor() {
    this.{entity}Service = new {Entity}Service()
  }

  async create(request, reply) {
    try {
      const {entity}Data = request.body
      const userId = request.user.id
      
      this.{entity}Service.prisma = request.server.prisma
      const {entity} = await this.{entity}Service.create({entity}Data, userId)
      
      return reply.status(201).send({entity})
    } catch (error) {
      if (error.message.includes('already exists')) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: error.message
        })
      }
      
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to create {entity}'
      })
    }
  }

  async findMany(request, reply) {
    try {
      const { skip = 0, limit = 100, search } = request.query
      const userId = request.user.id
      
      this.{entity}Service.prisma = request.server.prisma
      const result = await this.{entity}Service.findMany(userId, {
        skip: parseInt(skip),
        take: parseInt(limit),
        search
      })
      
      const response = {
        items: result.items,
        total: result.total,
        page: Math.floor(skip / limit) + 1,
        size: parseInt(limit)
      }
      
      return reply.send(response)
    } catch (error) {
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch {entities}'
      })
    }
  }

  async findById(request, reply) {
    try {
      const { id } = request.params
      const userId = request.user.id
      
      this.{entity}Service.prisma = request.server.prisma
      const {entity} = await this.{entity}Service.findById(parseInt(id), userId)
      
      if (!{entity}) {
        return reply.status(404).send({
          error: 'Not Found',
          message: '{Entity} not found'
        })
      }
      
      return reply.send({entity})
    } catch (error) {
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch {entity}'
      })
    }
  }

  async update(request, reply) {
    try {
      const { id } = request.params
      const updateData = request.body
      const userId = request.user.id
      
      this.{entity}Service.prisma = request.server.prisma
      const {entity} = await this.{entity}Service.update(parseInt(id), updateData, userId)
      
      if (!{entity}) {
        return reply.status(404).send({
          error: 'Not Found',
          message: '{Entity} not found'
        })
      }
      
      return reply.send({entity})
    } catch (error) {
      if (error.message.includes('already exists')) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: error.message
        })
      }
      
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to update {entity}'
      })
    }
  }

  async delete(request, reply) {
    try {
      const { id } = request.params
      const userId = request.user.id
      
      this.{entity}Service.prisma = request.server.prisma
      const success = await this.{entity}Service.delete(parseInt(id), userId)
      
      if (!success) {
        return reply.status(404).send({
          error: 'Not Found',
          message: '{Entity} not found'
        })
      }
      
      return reply.status(204).send()
    } catch (error) {
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to delete {entity}'
      })
    }
  }
}

module.exports = new {Entity}Controller()
```

### Route Definitions
```javascript
// src/routes/{entity}.routes.js
const {entity}Controller = require('../controllers/{entity}.controller')
const {
  {entity}CreateSchema,
  {entity}UpdateSchema,
  {entity}ResponseSchema,
  {entity}ListSchema
} = require('../schemas/{entity}.schema')

async function {entity}Routes(fastify, options) {
  // Create {entity}
  fastify.post('/', {
    preHandler: [fastify.authenticate],
    schema: {
      body: {entity}CreateSchema,
      response: {
        201: {entity}ResponseSchema,
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      },
      tags: ['{entities}'],
      summary: 'Create a new {entity}'
    }
  }, {entity}Controller.create)

  // List {entities}
  fastify.get('/', {
    preHandler: [fastify.authenticate],
    schema: {
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 100 },
          search: { type: 'string', maxLength: 100 }
        }
      },
      response: {
        200: {entity}ListSchema
      },
      tags: ['{entities}'],
      summary: 'List {entities} with pagination'
    }
  }, {entity}Controller.findMany)

  // Get {entity} by ID
  fastify.get('/:id', {
    preHandler: [fastify.authenticate],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer', minimum: 1 }
        }
      },
      response: {
        200: {entity}ResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      },
      tags: ['{entities}'],
      summary: 'Get a {entity} by ID'
    }
  }, {entity}Controller.findById)

  // Update {entity}
  fastify.put('/:id', {
    preHandler: [fastify.authenticate],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer', minimum: 1 }
        }
      },
      body: {entity}UpdateSchema,
      response: {
        200: {entity}ResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      },
      tags: ['{entities}'],
      summary: 'Update a {entity}'
    }
  }, {entity}Controller.update)

  // Delete {entity}
  fastify.delete('/:id', {
    preHandler: [fastify.authenticate],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer', minimum: 1 }
        }
      },
      response: {
        204: { type: 'null' },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      },
      tags: ['{entities}'],
      summary: 'Delete a {entity}'
    }
  }, {entity}Controller.delete)
}

module.exports = {entity}Routes
```

## Task Breakdown

### Phase 1: Database Foundation (DatabaseArchitect)
- [ ] Design {Entity} Prisma schema with proper relationships
- [ ] Create Prisma migration
- [ ] Add appropriate indexes for query optimization
- [ ] Validate schema against requirements
- [ ] **Quality Gate**: Migration runs successfully, schema validated

### Phase 2: Backend Implementation (BackendEngineer)
- [ ] Implement JSON Schema validation
- [ ] Create {Entity}Service with business logic
- [ ] Implement Fastify routes with all CRUD endpoints
- [ ] Add proper error handling and HTTP status codes
- [ ] Integrate JWT authentication and authorization
- [ ] **Quality Gate**: All endpoints working, >90% test coverage, <200ms response

### Phase 3: Testing & Quality (QAEngineer)
- [ ] Write comprehensive Vitest test suite
- [ ] Test all API endpoints with different scenarios
- [ ] Test authentication and authorization
- [ ] Test edge cases and error conditions
- [ ] Performance testing for response times
- [ ] **Quality Gate**: All tests passing, coverage >90%

### Phase 4: Integration & Documentation (IntegrationExpert)
- [ ] Test end-to-end API workflows
- [ ] Validate OpenAPI documentation accuracy
- [ ] Test database migrations and rollbacks
- [ ] Performance testing under load
- [ ] **Quality Gate**: Complete integration working, docs accurate

## Validation Commands

### Database Validation
```bash
# Generate and apply Prisma migration
npx prisma migrate dev --name "add_{entity}_table"

# Generate Prisma client
npx prisma generate

# Check database connection
npx prisma studio
```

### Backend Testing
```bash
# Run all tests with coverage
npm test

# Test specific feature
npm test {entity}

# Run performance tests
npm run test:performance

# Check code quality
npm run lint
```

### API Validation
```bash
# Start development server
npm run dev

# Test API endpoints
curl -X GET "http://localhost:3000/{entities}" -H "Authorization: Bearer {token}"
curl -X POST "http://localhost:3000/{entities}" -H "Content-Type: application/json" -d '{data}'

# Check API docs
# Navigate to http://localhost:3000/docs
```

### Security Validation
```bash
# Check for security issues
npm audit

# Test JWT token validation
npm test -- auth
```

## Quality Gates

### Database Quality Gates
- [ ] Prisma schema properly defined with relationships
- [ ] Migration script created and tested
- [ ] Database indexes optimized for expected queries
- [ ] Migration rollback tested successfully
- [ ] Schema follows naming conventions

### Backend Quality Gates  
- [ ] All CRUD endpoints implemented and working
- [ ] JSON Schema validation with proper error messages
- [ ] Service layer with business logic separation
- [ ] JWT authentication integrated correctly
- [ ] Error handling with proper HTTP status codes
- [ ] Response times <200ms for all endpoints
- [ ] >90% test coverage with Vitest

### API Quality Gates
- [ ] OpenAPI docs auto-generated and accurate
- [ ] RESTful API design principles followed
- [ ] Proper pagination implemented
- [ ] Input validation working correctly
- [ ] CORS configured properly (if needed)
- [ ] API versioning strategy followed

### Security Quality Gates
- [ ] JWT tokens properly validated
- [ ] Input sanitization implemented
- [ ] SQL injection protection verified (Prisma ORM)
- [ ] Authorization checks on all protected endpoints
- [ ] Security headers configured
- [ ] Rate limiting implemented (if needed)

## Anti-Patterns to Avoid
- ❌ Don't bypass Prisma ORM for raw SQL queries
- ❌ Don't skip input validation on API endpoints
- ❌ Don't hardcode sensitive data (use environment variables)
- ❌ Don't ignore proper HTTP status codes
- ❌ Don't skip authentication on protected endpoints
- ❌ Don't forget to handle Prisma client errors properly
- ❌ Don't ignore database constraints and relationships

## Final Validation Checklist
- [ ] All API endpoints working correctly
- [ ] Database schema properly designed with Prisma
- [ ] >90% test coverage achieved
- [ ] Security requirements satisfied
- [ ] Performance requirements met (<200ms)
- [ ] OpenAPI documentation complete
- [ ] Error handling comprehensive
- [ ] Ready for production deployment

---

## Notes
- Use Prisma Client for all database operations
- Follow Fastify best practices for plugin architecture
- Implement proper logging for debugging and monitoring
- Consider rate limiting for production deployment
- Use Prisma migrations for schema changes
- Leverage JSON Schema for comprehensive input validation