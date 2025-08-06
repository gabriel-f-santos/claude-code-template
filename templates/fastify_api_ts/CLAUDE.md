# 🚀 Fastify TypeScript Vibecoding API Template

## Type-Safe Vibecoding Architecture - Perfect for Rapid Development!

This template follows the **vibecoding** philosophy with **full TypeScript support**: simple, modular, demonstrable code perfect for rapid API development (15-minute features) and live coding sessions with Claude Code subagents.

## 🏗️ Type-Safe Vibecoding Structure
```
├── src/
│   ├── types/             # TypeScript definitions
│   │   └── index.ts            # All type definitions
│   ├── routes/            # API endpoints (type-safe)
│   │   ├── users.routes.ts     # User management routes
│   │   └── products.routes.ts  # Product management routes
│   ├── controllers/       # Request/response handlers (typed)
│   │   ├── users.controller.ts # User business logic
│   │   └── products.controller.ts # Product business logic  
│   ├── services/          # Pure business logic (typed)
│   │   ├── users.service.ts    # User data operations
│   │   └── products.service.ts # Product data operations
│   ├── schemas/           # JSON Schema validation (typed)
│   │   ├── users.schema.ts     # User validation rules
│   │   └── products.schema.ts  # Product validation rules
│   ├── plugins/           # Fastify plugins (typed)
│   │   ├── db.ts              # Database connection
│   │   └── auth.ts            # JWT authentication
│   ├── utils/             # Helper functions (typed)
│   │   ├── error-handler.ts   # Error management
│   │   └── validators.ts      # Input validation
│   └── app.ts            # Main Fastify application
├── tests/                 # Type-safe tests
│   ├── users.test.ts          # User API tests
│   └── products.test.ts       # Product API tests
├── prisma/               # Database schema
│   └── schema.prisma          # Simple, clean models
├── tsconfig.json         # TypeScript configuration
└── package.json          # Modern dependencies
```

## ⚡ Quick Start Commands
```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Start development server (TypeScript + hot reload)
npm run dev

# Build TypeScript
npm run build

# Run built application
npm run start

# Run tests with TypeScript
npm run test

# Type checking only
npm run type-check

# Open Prisma Studio (database GUI)
npm run db:studio

# Access API documentation
# http://localhost:3000/docs

# Test a complete feature in < 15 minutes with full type safety!
curl -X POST "http://localhost:3000/api/users/register" \
     -H "Content-Type: application/json" \
     -d '{"username": "demo", "email": "demo@example.com", "name": "Demo User", "password": "password123"}'
```

## 🔥 TypeScript Vibecoding Patterns

### Type-Safe Controller Pattern
Controllers with full TypeScript support - perfect for demos:
```typescript
export class UsersController {
  private readonly usersService: UsersService;

  public createUser: RouteHandler<unknown, unknown, UserCreateRequest> = 
    asyncHandler(async (request, reply) => {
      const user = await this.usersService.createUser(request.body);
      reply.code(201).send(user);
    });
}
```

### Type-Safe Service Layer Pattern
Business logic with complete type safety - easy to test and demo:
```typescript
export class UsersService implements IUserService {
  async createUser(userData: UserCreateRequest): Promise<UserResponse> {
    const validatedData = quickValidation.createUser(userData);
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    
    const user = await this.prisma.user.create({
      data: { ...validatedData, password: hashedPassword },
      select: { id: true, username: true, email: true, name: true }
    });
    
    return user as UserResponse;
  }
}
```

### Type-Safe Validation & Documentation
JSON Schema with TypeScript interfaces - automatic validation AND docs:
```typescript
export const usersSchemas = {
  createUser: {
    description: 'Register a new user',
    tags: ['users'],
    body: {
      type: 'object',
      properties: {
        username: { type: 'string', minLength: 3, maxLength: 20 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 }
      },
      required: ['username', 'email', 'password']
    }
  } as FastifySchema
};
```

### Type-Safe Authentication
JWT auth with full TypeScript support:
```typescript
// Protected route with typed request
const getCurrentUser: AuthenticatedRouteHandler = asyncHandler(
  async (request, reply) => {
    // request.user is fully typed!
    const user = await this.usersService.getUserById(request.user.id);
    reply.send(user);
  }
);
```

## 🎯 TypeScript Benefits

### 🛡️ **Type Safety**
- Compile-time error detection
- IntelliSense and autocomplete
- Refactoring confidence
- Documentation through types

### 🚀 **Enhanced Development Experience**
- IDE support with error highlighting
- Auto-completion for API endpoints
- Type-safe database operations
- Runtime error prevention

### 📚 **Self-Documenting Code**
- Types serve as documentation
- Clear interface contracts
- Easier onboarding for new developers
- Better maintainability

## 🧪 Type-Safe Testing Philosophy

### Comprehensive Type-Safe Test Coverage
Every endpoint tested with TypeScript types:
```typescript
test('should register a new user successfully', async () => {
  const userData: UserCreateRequest = {
    username: 'test',
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
  const result = response.json<UserResponse>(); // Fully typed response!
  expect('password' in result).toBe(false); // Type-safe security check
});
```

## 🤖 Claude Code TypeScript Subagent Prompts

### TypeScript Vibecoding Fastify Expert
**Perfect for rapid 15-minute type-safe feature development!**

```
You are a TypeScript Vibecoding Fastify Expert specializing in type-safe rapid API development.

CONTEXT: This project uses the vibecoding architecture with full TypeScript support:
- Simple modular structure: routes → controllers → services
- Complete type safety with TypeScript interfaces
- JSON Schema validation with FastifySchema types
- Prisma ORM with generated types
- JWT authentication with typed decorators
- Comprehensive testing with typed responses
- Focus on rapid development (5-15 minutes for complete features)

TYPESCRIPT VIBECODING PRINCIPLES:
- Keep it simple, fast, and type-safe
- Define clear interfaces for all data structures
- Use generic types for reusable patterns
- Leverage TypeScript's inference where possible
- Provide typed route handlers and responses
- Ensure compile-time error detection
- Perfect for demos and live coding

EXAMPLE TASK:
"Create a complete 'orders' feature with full TypeScript support including CRUD operations, user relationships, and product associations. Include proper types, validation, authentication, and tests. Make it ready to demo in 15 minutes with complete type safety."

WHAT TO INCLUDE:
1. Type definitions (src/types/index.ts additions)
2. Route definitions with FastifySchema (src/routes/orders.routes.ts)
3. Controller with typed handlers (src/controllers/orders.controller.ts)  
4. Service with interface implementation (src/services/orders.service.ts)
5. JSON Schema with TypeScript types (src/schemas/orders.schema.ts)
6. Comprehensive typed tests (tests/orders.test.ts)
7. Prisma model updates with proper types
```

### TypeScript API Troubleshooter
**For debugging and fixing TypeScript API issues!**

```
You are a TypeScript Vibecoding Fastify Troubleshooting Expert.

SPECIALIZES IN:
- TypeScript compilation errors
- Type inference problems
- Fastify plugin typing issues
- JSON Schema type compatibility
- Prisma type generation problems
- JWT authentication typing
- Route handler type errors
- Test typing issues

COMMON TYPESCRIPT ISSUES TO SOLVE:
- "Type 'X' is not assignable to type 'Y'"
- "Property 'X' does not exist on type 'Y'"
- "Cannot find module or its corresponding type declarations"
- "Fastify plugin type registration issues"
- "JSON Schema and TypeScript interface mismatches"
- "Prisma client type errors"

TYPESCRIPT DEBUGGING APPROACH:
- Focus on clear, type-safe solutions
- Provide proper interface definitions
- Explain type inference issues
- Ensure solution maintains type safety
- Keep the vibecoding architecture intact
- Provide working TypeScript examples
```

### TypeScript Performance Expert
**For high-performance type-safe API optimizations!**

```
You are a TypeScript Vibecoding Fastify Performance Expert.

CONTEXT: This TypeScript Fastify API prioritizes both performance and type safety.

FOCUS ON:
- Type-safe database query optimization with Prisma
- Efficient pagination with proper typing
- Connection pooling configuration with types
- JSON Schema performance with TypeScript
- Route optimization with typed handlers
- Memory usage optimization while maintaining types

TYPESCRIPT PERFORMANCE PATTERNS:
- Use Prisma's type-safe efficient queries
- Implement proper pagination with typed responses
- Optimize JSON Schema validation with types
- Use Fastify's typed serialization
- Database indexing with Prisma schema
- Generic types for reusable patterns

EXAMPLE TASK:
"Optimize the products API with full TypeScript support for handling 10,000+ products with efficient type-safe search, filtering, and pagination. Include proper indexing and query optimization while maintaining complete type safety."
```

## ⚡ TypeScript Vibecoding Benefits

### 🚀 **Lightning Fast Development with Safety**
- Complete CRUD APIs in 15 minutes with type safety
- Live coding ready with full IntelliSense
- Perfect for demonstrations with error prevention
- Claude Code subagent optimized with types

### 🎯 **Clean Type-Safe Architecture**
- Clear separation of concerns with interfaces
- Easy to test and maintain with types
- Simple mental model with safety guarantees
- Great for teaching with compile-time checks

### 🔧 **Production Ready with Types**
- Comprehensive error handling with typed errors
- JWT authentication with typed payloads
- Input validation with schema types
- API documentation with TypeScript integration
- Database migrations with type generation
- Health checks with typed responses

### 📚 **Superior Documentation**
- Automatic Swagger/OpenAPI docs with types
- Self-documenting TypeScript interfaces
- Interactive API explorer with type hints
- Perfect for demos with intelligent suggestions

## 🔧 Environment Setup

Copy `.env.example` to `.env` and customize:

```bash
# 🚀 Fastify TypeScript Vibecoding API Environment Configuration
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production-please"
TS_NODE_PROJECT=./tsconfig.json
```

## 📈 What You Get Out of the Box

✅ **Complete User System** - Registration, login, profiles (typed)  
✅ **Product Management** - CRUD with advanced filtering (typed)  
✅ **JWT Authentication** - Secure API access (typed)  
✅ **Input Validation** - Automatic with JSON Schema (typed)  
✅ **API Documentation** - Interactive Swagger UI (typed)  
✅ **Comprehensive Tests** - 100% endpoint coverage (typed)  
✅ **Database Management** - Prisma ORM with generated types  
✅ **Error Handling** - Consistent error responses (typed)  
✅ **Development Tools** - Hot reload, database GUI (typed)  
✅ **Production Ready** - Security, logging, CORS (typed)  
✅ **Full Type Safety** - Compile-time error detection  
✅ **IntelliSense Support** - Complete autocomplete and hints

## 🎯 Perfect for Type-Safe Live Coding Sessions!

This template is specifically designed for:
- **Claude Code subagent development** with full type safety
- **Live coding demonstrations** with error prevention
- **Rapid prototyping** with compile-time checks
- **Teaching API development** with type safety
- **Building MVPs quickly** with confidence
- **Technical interviews** with impressive type coverage

Start coding with complete type safety and see results in seconds, not hours! 🚀

## 🎯 Feature Development Guide

### 📋 **Step-by-Step Process for Adding New Features**

Siga este processo rigorosamente para manter a consistência arquitetural vibecoding com TypeScript:

#### **1. 📁 Create Feature Structure**
```bash
# Exemplo: Adicionando feature "Orders"
mkdir -p src/{routes,controllers,services,schemas,types}

# Os arquivos específicos da feature
touch src/types/orders.types.ts
touch src/schemas/orders.schema.ts
touch src/services/orders.service.ts
touch src/controllers/orders.controller.ts  
touch src/routes/orders.routes.ts
touch tests/orders.test.ts
```

#### **2. 📊 Types Definition (TypeScript)**
```bash
# 1. Define all TypeScript interfaces first
# src/types/orders.types.ts (or add to src/types/index.ts)

# 2. Update Prisma schema with new model
# prisma/schema.prisma

# 3. Generate types
npm run db:generate
```

#### **3. 💾 Service Layer (Business Logic)**
```bash
# Implemente o service com tipagem completa
# src/services/orders.service.ts
```

#### **4. 🎨 API Layer (Routes & Controllers)**
```bash
# 1. Create type-safe JSON Schema validation
# 2. Implement type-safe controller methods  
# 3. Define route endpoints with proper typing
# 4. Register routes in main app
```

#### **5. 🧪 Testing**
```bash
# Create comprehensive type-safe tests
touch tests/orders.test.ts
npm run test
```

### 🤖 **Claude Code Prompt Templates**

#### **📝 Complete TypeScript CRUD Feature Prompt**
```
Você é um especialista em Fastify TypeScript Vibecoding API development.

TAREFA: Criar a feature "Orders" completa seguindo nossa arquitetura vibecoding TypeScript.

ARQUITETURA OBRIGATÓRIA:
src/
├── types/orders.types.ts (TypeScript interfaces)
├── schemas/orders.schema.ts (JSON Schema + FastifySchema)
├── services/orders.service.ts (business logic + Prisma)
├── controllers/orders.controller.ts (HTTP layer)
├── routes/orders.routes.ts (route definitions)
└── tests/orders.test.ts (comprehensive tests)

REQUISITOS TÉCNICOS:
✅ Full TypeScript type safety
✅ FastifySchema with proper typing
✅ Type-safe JSON Schema validation
✅ Swagger documentation with TypeScript integration
✅ Type-safe error handling
✅ Prisma ORM with generated types
✅ Type-safe pagination
✅ Comprehensive typed tests

FUNCIONALIDADES:
- GET /orders (list with pagination, filters)
- GET /orders/:id (get by ID)
- POST /orders (create with validation)
- PUT /orders/:id (update)
- DELETE /orders/:id (delete)
- GET /orders/user/:userId (orders by user)

TYPESCRIPT INTERFACES NECESSÁRIAS:
```typescript
// Domain types
export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderCreateRequest {
  userId: number;
  items: OrderItemRequest[];
}

export interface OrderUpdateRequest {
  status?: OrderStatus;
  items?: OrderItemRequest[];
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}
```

PRISMA MODEL NECESSÁRIO:
```prisma
model Order {
  id          Int      @id @default(autoincrement())
  userId      Int
  totalAmount Float
  status      String   @default("pending")
  items       Json
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id])
  @@map("orders")
}
```

PADRÕES TYPESCRIPT VIBECODING:
- Service class implementing typed interface
- Controller with typed route handlers
- Routes with FastifySchema typing
- Type-safe error handling
- Typed tests with proper assertions
- Generic types for reusability

ENTREGUE: Código TypeScript completo com tipagem total + update do Prisma schema.
```

#### **📱 Simple TypeScript Feature Prompt**
```
TAREFA: Criar feature "Categories" simples com TypeScript.

ARQUITETURA MÍNIMA:
- src/types/categories.types.ts (interfaces)
- src/schemas/categories.schema.ts (FastifySchema)
- src/services/categories.service.ts (typed service)
- src/controllers/categories.controller.ts (typed controller)
- src/routes/categories.routes.ts (typed routes)
- tests/categories.test.ts (typed tests)

FUNCIONALIDADES:
- CRUD básico com full type safety
- Validação com tipos TypeScript
- Testes tipados

FOCO EM: Type safety, simplicidade, reutilização.
```

#### **🔄 Extend Existing TypeScript Feature Prompt**
```
TAREFA: Adicionar "Comments" tipados à feature Users existente.

MODIFICAÇÕES NECESSÁRIAS:

1. src/types/index.ts
   - Adicionar Comment interfaces
   - Estender User types se necessário

2. prisma/schema.prisma
   - Adicionar model Comment com userId foreign key

3. src/services/users.service.ts
   - Adicionar métodos tipados: getUserComments, addComment
   - Implementar IUserService interface

4. src/controllers/users.controller.ts
   - Adicionar handlers tipados para comments
   - RouteHandler types apropriados

5. src/routes/users.routes.ts
   - GET /users/:id/comments (with FastifySchema)
   - POST /users/:id/comments (with validation)

6. src/schemas/users.schema.ts
   - Adicionar comment schemas tipados

7. tests/users.test.ts
   - Adicionar testes tipados para comments

MANTENHA: Type safety total, arquitetura existente.
```

### 🏗️ **TypeScript Architecture Decision Tree**

```
Nova Feature TypeScript?
├── Precisa de tipos complexos? 
│   ├── SIM → Criar interfaces detalhadas + types file
│   └── NÃO → Usar tipos básicos inline
├── É extensão de feature existente?
│   ├── SIM → Estender interfaces existentes
│   └── NÃO → Criar nova estrutura tipada completa
├── Complexidade alta?
│   ├── SIM → Usar generics + utility types
│   └── NÃO → Interfaces simples
├── Precisa de validação runtime?
│   ├── SIM → JSON Schema + TypeScript interfaces
│   └── NÃO → Apenas TypeScript types
```

### 📐 **TypeScript Architectural Rules (NEVER BREAK)**

#### **✅ ALWAYS DO:**
1. **Type everything**: Interfaces, function params, returns
2. **Strict typing**: Enable strict mode in tsconfig
3. **Interface segregation**: Small, focused interfaces
4. **Generic reusability**: Use generics for common patterns
5. **Type-safe error handling**: Typed error classes
6. **Prisma type integration**: Use generated Prisma types
7. **Test typing**: Type assertions in tests

#### **❌ NEVER DO:**
1. **Use 'any' type**: Except for very specific cases
2. **Skip interface definition**: Every data structure needs types
3. **Ignore TypeScript errors**: Fix all compilation errors
4. **Mix JS and TS patterns**: Stay consistent with TS
5. **Skip generic opportunities**: Reuse types when possible
6. **Forget export/import types**: Proper type module structure

### 🔄 **TypeScript Reasoning Process**

#### **Before Adding Any Feature:**
1. **Define data types**: What interfaces are needed?
2. **Plan type relationships**: How types connect?
3. **Consider generics**: Can types be reusable?
4. **Design API contracts**: Input/output type definitions
5. **Plan error types**: What errors can occur?

#### **During Development:**
1. **Start with types**: Define all interfaces first
2. **Implement service**: Business logic with types
3. **Create controller**: HTTP layer with type safety
4. **Define routes**: Endpoints with FastifySchema
5. **Write typed tests**: Type-safe test scenarios
6. **Generate docs**: TypeScript-integrated Swagger

#### **After Implementation:**
1. **Type check**: npm run type-check
2. **Test compilation**: Ensure no TS errors
3. **Runtime testing**: Validate type safety works
4. **Documentation**: Types serve as documentation
5. **Performance review**: Check type overhead

### 🎯 **TypeScript Feature Checklist**

Antes de considerar a feature "completa":

- [ ] **Types**: Todas interfaces definidas?
- [ ] **Type Safety**: Zero TypeScript errors?
- [ ] **Service**: Business logic totalmente tipada?
- [ ] **Controller**: HTTP handlers com tipos corretos?
- [ ] **Routes**: FastifySchema com typing?
- [ ] **Schemas**: JSON Schema + TS integration?
- [ ] **Tests**: Testes com type assertions?
- [ ] **Prisma**: Database types atualizados?
- [ ] **Error Handling**: Erros tipados?
- [ ] **Documentation**: Swagger com tipos?

### 💡 **TypeScript Pro Tips for Claude Code**

1. **Start with interfaces**: Define contratos antes do código
2. **Use utility types**: Partial<T>, Pick<T, K>, Omit<T, K>
3. **Generic services**: Reutilize patterns com generics
4. **Strict compilation**: --strict flag sempre ativo
5. **Type guards**: Para validação runtime quando necessário
6. **Import type**: Use `import type` para types-only imports

### 📊 **TypeScript Example Templates**

#### **Service Interface Template**
```typescript
interface IFeatureService {
  getAll(query?: PaginationQuery): Promise<PaginatedResponse<Feature>>;
  getById(id: number): Promise<Feature>;
  create(data: FeatureCreateRequest): Promise<Feature>;
  update(id: number, data: FeatureUpdateRequest): Promise<Feature>;
  delete(id: number): Promise<void>;
}

export class FeatureService implements IFeatureService {
  constructor(private readonly prisma: PrismaClient) {}
  
  async getAll(query: PaginationQuery = {}): Promise<PaginatedResponse<Feature>> {
    // Implementation with full type safety
  }
  
  // ... more typed methods
}
```

#### **Typed Controller Template**  
```typescript
export class FeatureController {
  private readonly featureService: IFeatureService;

  constructor(fastify: FastifyInstanceWithDecorators) {
    this.featureService = new FeatureService(fastify.prisma);
  }

  public getAll: RouteHandler<PaginationQuery> = asyncHandler(
    async (request, reply) => {
      const result = await this.featureService.getAll(request.query);
      reply.send(result);
    }
  );

  // ... more typed handlers
}
```

#### **Typed Routes Template**
```typescript
const featureRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstanceWithDecorators
) => {
  const featureController = new FeatureController(fastify);

  fastify.get<{ Querystring: PaginationQuery }>('/features', {
    schema: featureSchemas.getAll
  }, featureController.getAll);

  // ... more typed routes
};

export default featureRoutes;
```

### 🎯 **Type Safety Benefits**

#### **🛡️ Compile-time Safety**
- Catch errors before runtime
- Refactoring confidence
- Better IDE support

#### **📚 Self-documenting Code**
- Interfaces serve as contracts
- Clear API definitions
- Easier team collaboration

#### **🚀 Enhanced Productivity**
- IntelliSense autocomplete
- Type-safe refactoring
- Reduced debugging time

Ready to vibecode your next type-safe API! ⚡