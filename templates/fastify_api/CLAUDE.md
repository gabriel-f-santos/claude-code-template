# 🚀 Fastify Vibecoding API Template

## Vibecoding Architecture - Perfect for Rapid Development!

This template follows the **vibecoding** philosophy: simple, modular, demonstrable code perfect for rapid API development (15-minute features) and live coding sessions with Claude Code subagents.

## 🏗️ Simple Vibecoding Structure
```
├── src/
│   ├── routes/            # API endpoints (clean & focused)
│   │   ├── users.routes.js      # User management routes
│   │   └── products.routes.js   # Product management routes
│   ├── controllers/       # Request/response handlers
│   │   ├── users.controller.js  # User business logic
│   │   └── products.controller.js # Product business logic
│   ├── services/          # Pure business logic
│   │   ├── users.service.js     # User data operations
│   │   └── products.service.js  # Product data operations
│   ├── schemas/           # JSON Schema validation
│   │   ├── users.schema.js      # User validation rules
│   │   └── products.schema.js   # Product validation rules
│   ├── plugins/           # Fastify plugins
│   │   ├── db.js               # Database connection
│   │   └── auth.js             # JWT authentication
│   ├── utils/             # Helper functions
│   │   ├── error-handler.js    # Error management
│   │   └── validators.js       # Input validation
│   └── app.js            # Main Fastify application
├── tests/                 # Comprehensive tests
│   ├── users.test.js           # User API tests
│   └── products.test.js        # Product API tests
├── prisma/               # Database schema
│   └── schema.prisma          # Simple, clean models
└── package.json          # Modern dependencies
```

## ⚡ Quick Start Commands
```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Start development server (with hot reload)
npm run dev

# Run tests with coverage
npm run test

# Open Prisma Studio (database GUI)
npm run db:studio

# Access API documentation
# http://localhost:3000/docs

# Test a complete feature in < 15 minutes!
curl -X POST "http://localhost:3000/api/users/register" \
     -H "Content-Type: application/json" \
     -d '{"username": "demo", "email": "demo@example.com", "name": "Demo User", "password": "password123"}'
```

## 🔥 Vibecoding Patterns

### Clean Controller Pattern
Controllers handle HTTP only - perfect for demos:
```javascript
export class UsersController {
  constructor(fastify) {
    this.usersService = new UsersService(fastify.prisma);
    this.fastify = fastify;
  }

  createUser = asyncHandler(async (request, reply) => {
    const user = await this.usersService.createUser(request.body);
    reply.code(201).send(user);
  });
}
```

### Service Layer Pattern
Business logic in clean services - easy to test and demo:
```javascript
export class UsersService {
  async createUser(userData) {
    const validatedData = quickValidation.createUser(userData);
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    
    const user = await this.prisma.user.create({
      data: { ...validatedData, password: hashedPassword },
      select: { id: true, username: true, email: true, name: true }
    });
    
    return user;
  }
}
```

### Automatic Validation & Documentation
JSON Schema provides validation AND Swagger docs:
```javascript
const createUserSchema = {
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
};
```

### Authentication Made Simple
JWT auth with Fastify decorators:
```javascript
// Protected route
fastify.get('/users/me', {
  schema: getCurrentUserSchema,
  preHandler: [fastify.authenticate] // Just add this line!
}, usersController.getCurrentUser);
```

## 🧪 Testing Philosophy

### Comprehensive Test Coverage
Every endpoint tested with real scenarios:
```javascript
test('should register a new user successfully', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/users/register',
    payload: { username: 'test', email: 'test@example.com', password: 'password123' }
  });
  
  expect(response.statusCode).toBe(201);
  expect(response.json().password).toBeUndefined(); // Security check
});
```

## 🤖 Claude Code Subagent Prompts

### Vibecoding Fastify Feature Developer
**Perfect for rapid 15-minute feature development!**

```
You are a Vibecoding Fastify Expert specializing in rapid API development.

CONTEXT: This project uses the vibecoding architecture:
- Simple modular structure: routes → controllers → services
- JSON Schema validation with automatic Swagger docs
- Prisma ORM for database operations
- JWT authentication with Fastify decorators
- Comprehensive testing with Vitest
- Focus on rapid development (5-15 minutes for complete features)

VIBECODING PRINCIPLES:
- Keep it simple and fast
- One controller per domain (UsersController, ProductsController, etc.)
- Services handle business logic only
- Routes are thin and focused
- Automatic validation and documentation
- Perfect for demos and live coding

EXAMPLE TASK:
"Create a complete 'orders' feature with CRUD operations, user relationships, and product associations. Include validation, authentication, and tests. Make it ready to demo in 15 minutes."

WHAT TO INCLUDE:
1. Route definitions (src/routes/orders.routes.js)
2. Controller with clean HTTP handling (src/controllers/orders.controller.js)  
3. Service with business logic (src/services/orders.service.js)
4. JSON Schema validation (src/schemas/orders.schema.js)
5. Comprehensive tests (tests/orders.test.js)
6. Prisma model updates if needed
```

### Vibecoding API Troubleshooter
**For debugging and fixing API issues!**

```
You are a Vibecoding Fastify Troubleshooting Expert.

SPECIALIZES IN:
- Fastify plugin issues
- JSON Schema validation problems
- Prisma database errors
- JWT authentication debugging
- Route registration issues
- Test failures and fixes

COMMON FASTIFY ISSUES TO SOLVE:
- "Plugin registration order problems"
- "JSON Schema validation not working"
- "Prisma client connection issues"
- "JWT token validation failures"
- "Route conflicts and overlaps"
- "Test database setup problems"

VIBECODING DEBUGGING APPROACH:
- Focus on simple, clear solutions
- Provide working code examples
- Explain the root cause briefly
- Ensure solution works in live demos
- Maintain the vibecoding architecture
```

### Vibecoding Performance Expert
**For high-performance API optimizations!**

```
You are a Vibecoding Fastify Performance Expert.

CONTEXT: This Fastify API prioritizes performance while maintaining simplicity.

FOCUS ON:
- Database query optimization with Prisma
- Efficient pagination patterns
- Connection pooling configuration  
- JSON Schema performance
- Route optimization
- Memory usage optimization

VIBECODING PERFORMANCE PATTERNS:
- Use Prisma's efficient queries (select, include)
- Implement proper pagination with count queries
- Optimize JSON Schema validation
- Use Fastify's built-in serialization
- Database indexing strategies

EXAMPLE TASK:
"Optimize the products API for handling 10,000+ products with efficient search, filtering, and pagination. Include proper indexing and query optimization."
```

## ⚡ Vibecoding Benefits

### 🚀 **Lightning Fast Development**
- Complete CRUD APIs in 15 minutes
- Live coding ready
- Perfect for demonstrations
- Claude Code subagent optimized

### 🎯 **Clean Architecture**
- Clear separation of concerns
- Easy to test and maintain
- Simple mental model
- Great for teaching

### 🔧 **Production Ready**
- Comprehensive error handling
- JWT authentication
- Input validation
- API documentation
- Database migrations
- Health checks

### 📚 **Great Documentation**
- Automatic Swagger/OpenAPI docs
- Self-documenting JSON schemas
- Interactive API explorer
- Perfect for demos

## 🎯 Key Features Showcase

### Complete User Management
- Registration with validation
- JWT authentication
- Profile management
- Password hashing
- Real-time availability checks

### Product Management System
- Full CRUD operations
- Advanced filtering and search
- Category management
- Stock tracking
- Price management

### Developer Experience
- Hot reload development
- Comprehensive testing
- Database GUI (Prisma Studio)
- API documentation
- Error handling

## 🔧 Environment Setup

Copy `.env.example` to `.env` and customize:

```bash
# 🚀 Fastify Vibecoding API Environment Configuration
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production-please"
```

## 🎯 Perfect for Live Coding Sessions!

This template is specifically designed for:
- **Claude Code subagent development**
- **Live coding demonstrations**
- **Rapid prototyping**
- **Teaching API development**
- **Building MVPs quickly**
- **Technical interviews**

Start coding and see results in seconds, not hours! 🚀

## 📈 What You Get Out of the Box

✅ **Complete User System** - Registration, login, profiles  
✅ **Product Management** - CRUD with advanced filtering  
✅ **JWT Authentication** - Secure API access  
✅ **Input Validation** - Automatic with JSON Schema  
✅ **API Documentation** - Interactive Swagger UI  
✅ **Comprehensive Tests** - 100% endpoint coverage  
✅ **Database Management** - Prisma ORM with SQLite  
✅ **Error Handling** - Consistent error responses  
✅ **Development Tools** - Hot reload, database GUI  
✅ **Production Ready** - Security, logging, CORS

## 🎯 Feature Development Guide

### 📋 **Step-by-Step Process for Adding New Features**

Siga este processo rigorosamente para manter a consistência arquitetural vibecoding:

#### **1. 📁 Create Feature Structure**
```bash
# Exemplo: Adicionando feature "Orders"
mkdir -p src/{routes,controllers,services,schemas}

# Os arquivos específicos da feature
touch src/routes/orders.routes.js
touch src/controllers/orders.controller.js  
touch src/services/orders.service.js
touch src/schemas/orders.schema.js
touch tests/orders.test.js
```

#### **2. 📊 Database Model (Prisma)**
```bash
# 1. Update Prisma schema
# Adicione o modelo no prisma/schema.prisma

# 2. Generate and push changes
npm run db:generate
npm run db:push
```

#### **3. 💾 Service Layer (Business Logic)**
```bash
# Implemente primeiro o service com toda a lógica de negócios
# src/services/orders.service.js
```

#### **4. 🎨 API Layer (Routes & Controllers)**
```bash
# 1. Create JSON Schema validation
# 2. Implement controller methods  
# 3. Define route endpoints
# 4. Register routes in main app
```

#### **5. 🧪 Testing**
```bash
# Create comprehensive tests
touch tests/orders.test.js
npm run test
```

### 🤖 **Claude Code Prompt Templates**

#### **📝 Complete CRUD Feature Prompt**
```
Você é um especialista em Fastify Vibecoding API development.

TAREFA: Criar a feature "Orders" completa seguindo nossa arquitetura vibecoding.

ARQUITETURA OBRIGATÓRIA:
src/
├── schemas/orders.schema.js (JSON Schema + Swagger docs)
├── services/orders.service.js (business logic + Prisma)
├── controllers/orders.controller.js (HTTP layer)
├── routes/orders.routes.js (route definitions)
└── tests/orders.test.js (comprehensive tests)

REQUISITOS TÉCNICOS:
✅ JSON Schema validation para todos endpoints
✅ Swagger documentation automática
✅ Error handling com classes customizadas
✅ Prisma ORM para database operations
✅ Paginação para listagens
✅ Testes com 100% de cobertura dos endpoints
✅ Async/await em todas operações

FUNCIONALIDADES:
- GET /orders (list with pagination, filters)
- GET /orders/:id (get by ID)
- POST /orders (create with validation)
- PUT /orders/:id (update)
- DELETE /orders/:id (delete)
- GET /orders/user/:userId (orders by user)

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

PADRÕES VIBECODING:
- Service class com métodos estáticos
- Controller com asyncHandler wrapper
- Routes com schema validation
- Error handling consistente
- Testes usando app.inject()

ENTREGUE: Código completo de todos os arquivos + update do Prisma schema.
```

#### **📱 Simple Feature Prompt**
```
TAREFA: Criar feature "Categories" simples (apenas CRUD básico).

ARQUITETURA MÍNIMA:
- src/schemas/categories.schema.js
- src/services/categories.service.js  
- src/controllers/categories.controller.js
- src/routes/categories.routes.js
- tests/categories.test.js

FUNCIONALIDADES:
- CRUD básico (Create, Read, Update, Delete)
- Validação simples
- Testes essenciais

NÃO PRECISA: Relacionamentos complexos, business logic avançada.
```

#### **🔄 Extend Existing Feature Prompt**
```
TAREFA: Adicionar "Comments" à feature Users existente.

MODIFICAÇÕES NECESSÁRIAS:

1. prisma/schema.prisma
   - Adicionar model Comment com userId foreign key

2. src/services/users.service.js
   - Adicionar getUserComments(userId)
   - Adicionar addComment(userId, commentData)

3. src/controllers/users.controller.js
   - Adicionar endpoints para comments

4. src/routes/users.routes.js
   - GET /users/:id/comments
   - POST /users/:id/comments

5. src/schemas/users.schema.js
   - Adicionar comment schemas

6. tests/users.test.js
   - Adicionar testes para comment endpoints

MANTENHA: Arquitetura existente, apenas estenda funcionalidades.
```

### 🏗️ **Architecture Decision Tree**

```
Nova Feature?
├── Precisa de database? 
│   ├── SIM → Criar Prisma model + migration
│   └── NÃO → Apenas service/controller
├── É extensão de feature existente?
│   ├── SIM → Adicionar aos arquivos existentes
│   └── NÃO → Criar nova estrutura completa
├── Complexidade alta?
│   ├── SIM → Adicionar validação + business logic
│   └── NÃO → CRUD simples
├── Precisa de autenticação?
│   ├── SIM → Adicionar preHandler: [fastify.authenticate]
│   └── NÃO → Rotas públicas
```

### 📐 **Architectural Rules (NEVER BREAK)**

#### **✅ ALWAYS DO:**
1. **Layer separation**: Routes → Controllers → Services → Database
2. **JSON Schema validation**: Todo endpoint deve ter schema
3. **Error handling**: Use asyncHandler em controllers
4. **Consistent responses**: Mesmo formato para todos endpoints
5. **Prisma transactions**: Para operações complexas
6. **Comprehensive tests**: Teste todos cenários
7. **Swagger docs**: Documentação automática

#### **❌ NEVER DO:**
1. **Direct DB in controllers**: Use sempre services
2. **Skip validation**: Todo input deve ser validado
3. **Inconsistent naming**: Siga os padrões existentes
4. **Missing error handling**: Trate todos os casos
5. **Skip tests**: Toda feature precisa de testes
6. **Hardcoded values**: Use sempre configurações

### 🔄 **Reasoning Process for Features**

#### **Before Adding Any Feature:**
1. **Define endpoints**: Quais rotas serão necessárias?
2. **Design data model**: Como será armazenado no DB?
3. **Plan validation**: Que dados precisam ser validados?
4. **Consider auth**: Precisa de autenticação/autorização?
5. **Think about relationships**: Conecta com outras features?

#### **During Development:**
1. **Start with schema**: Prisma model primeiro
2. **Build service**: Lógica de negócios
3. **Create controller**: Camada HTTP
4. **Define routes**: Endpoints e validação
5. **Write tests**: Cobertura completa
6. **Generate docs**: Swagger automático

#### **After Implementation:**
1. **Test manually**: Use Postman ou curl
2. **Check docs**: Verifique Swagger UI
3. **Run all tests**: npm run test
4. **Performance check**: Para endpoints com muitos dados
5. **Security review**: Validação e sanitização

### 🎯 **Quick Feature Checklist**

Antes de considerar a feature "completa":

- [ ] **Database**: Modelo Prisma criado e migrado?
- [ ] **Service**: Lógica de negócios implementada?
- [ ] **Controller**: Handlers HTTP criados?
- [ ] **Routes**: Endpoints registrados com validação?
- [ ] **Schemas**: JSON Schema para validação/docs?
- [ ] **Tests**: Todos endpoints testados?
- [ ] **Docs**: Swagger funcionando?
- [ ] **Error handling**: Casos de erro tratados?
- [ ] **Authentication**: Se necessário, implementado?
- [ ] **Integration**: Registrado no app principal?

### 💡 **Pro Tips for Claude Code**

1. **Start with the complete prompt**: Use o template exato
2. **Follow layer order**: Service → Controller → Routes  
3. **Test incrementally**: Teste cada camada
4. **Check examples**: Use Users/Products como referência
5. **Validate early**: Schema validation desde o início
6. **Document everything**: Swagger é automático

### 📊 **Example File Templates**

#### **Service Template**
```javascript
export class FeatureService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAll(query = {}) {
    // Implementation with pagination
  }

  async getById(id) {
    // Implementation with error handling
  }

  async create(data) {
    // Implementation with validation
  }

  // ... more methods
}
```

#### **Controller Template**  
```javascript
export class FeatureController {
  constructor(fastify) {
    this.service = new FeatureService(fastify.prisma);
  }

  getAll = asyncHandler(async (request, reply) => {
    const result = await this.service.getAll(request.query);
    reply.send(result);
  });

  // ... more handlers
}
```

#### **Routes Template**
```javascript
export default async function featureRoutes(fastify) {
  const controller = new FeatureController(fastify);

  fastify.get('/features', {
    schema: featureSchemas.getAll
  }, controller.getAll);

  // ... more routes
}
```

Ready to vibecode your next API! ⚡