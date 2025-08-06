# FastAPI Beanie Vibecoding Template

## 🚀 Arquitetura Otimizada para Vibecoding & Claude Code

Esta é uma **arquitetura simplificada, modular e altamente escalável** especificamente projetada para:
- ⚡ **Vibecoding sessions** (desenvolvimento rápido ao vivo)
- 🤖 **Claude Code subagents** (integração eficiente)
- 🔄 **Rapid prototyping** (prototipagem rápida)
- 📺 **Live demonstrations** (demonstrações ao vivo)

## 🏗️ Estrutura Simplificada

```
app/
├── api/                   # 🎯 Endpoints organizados por entidade
│   ├── __init__.py
│   └── users.py          # Exemplo: CRUD completo de usuários
├── core/                  # ⚙️ Configurações e segurança
│   ├── __init__.py
│   ├── config.py         # Settings com Pydantic
│   ├── database.py       # Conexão MongoDB/Beanie
│   └── security.py       # JWT, hashing, auth
├── models/                # 📄 Beanie Documents (MongoDB)
│   ├── __init__.py
│   └── user.py           # Exemplo: User document
├── schemas/               # ✅ Pydantic schemas para validação
│   ├── __init__.py
│   └── user.py           # UserCreate, UserRead, UserUpdate...
├── services/              # 💼 Business logic desacoplada
│   ├── __init__.py
│   └── user_service.py   # UserService com todos CRUDs
├── main.py                # 🚀 FastAPI app factory
└── tests/                 # 🧪 Testes para vibecoding
    ├── __init__.py
    └── test_users.py     # Testes prontos para demos
```

## ⚡ Comandos Vibecoding

```bash
# 🚀 Start development server
python run.py

# 📖 API docs (automatic)
http://localhost:8000/docs

# 🧪 Run tests
pytest

# 🔄 Install dependencies
pip install -r requirements.txt

# 💾 Setup environment
cp .env.example .env
```

## 🎯 Exemplo Prático: API Users

### 1. Model (Beanie Document)
```python
# app/models/user.py
from beanie import Document
from pydantic import EmailStr, Field

class User(Document):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr = Field(..., unique=True)
    hashed_password: str
    is_active: bool = Field(default=True)
    
    class Settings:
        name = "users"
        indexes = ["email", "username"]
```

### 2. Schemas (Pydantic Validation)
```python
# app/schemas/user.py
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: str
    username: str
    email: EmailStr
    is_active: bool
```

### 3. Service (Business Logic)
```python
# app/services/user_service.py
class UserService:
    @staticmethod
    async def create_user(user_data: UserCreate) -> User:
        # Validations + hashing + create
        hashed_password = get_password_hash(user_data.password)
        user = User(username=user_data.username, ...)
        await user.insert()
        return user
```

### 4. API Routes (FastAPI Router)
```python
# app/api/users.py
from fastapi import APIRouter, status
from ..schemas.user import UserCreate, UserRead
from ..services.user_service import UserService

router = APIRouter()

@router.post("/register", response_model=UserRead, status_code=201)
async def register_user(user_data: UserCreate):
    return await UserService.create_user(user_data)

@router.get("/", response_model=List[UserRead])
async def get_users():
    return await UserService.get_users()
```

## 🤖 Prompts Claude Code para Vibecoding

### Subagent: FastAPI Vibecoding Expert
Use este agente para desenvolvimento rápido de APIs.

**Contexto**: Este projeto usa estrutura simples para vibecoding com FastAPI + Beanie. Sempre considere:
- Arquitetura modular simples (api, core, models, schemas, services)
- Beanie ODM para MongoDB (Document-based)
- Pydantic para validação automática
- Código limpo e demonstrável
- Padrões previsíveis para rápida expansão

**Tarefas que este agente pode fazer**:
- Criar CRUD completo para novas entidades (5 minutos)
- Implementar autenticação JWT rápida
- Adicionar validações e schemas Pydantic
- Criar testes básicos para demonstrações
- Configurar novas rotas e endpoints

**Exemplo de prompt**:
"Como um expert em FastAPI Vibecoding, implemente um CRUD completo para 'posts' incluindo: Beanie model, Pydantic schemas, service com business logic, API routes, e testes básicos. Estrutura deve ser idêntica ao users.py existente."

### Subagent: MongoDB Beanie Expert
Use este agente para operações de banco de dados.

**Contexto**: Este projeto usa Beanie ODM com MongoDB. Sempre considere:
- Documents ao invés de tabelas relacionais
- Índices MongoDB para performance
- Agregações para queries complexas
- Async/await em todas operações
- Validação Pydantic integrada

**Tarefas que este agente pode fazer**:
- Criar novos Document models
- Implementar relacionamentos entre documents
- Otimizar queries e agregações
- Configurar índices apropriados
- Criar migrations de schema

**Exemplo de prompt**:
"Como um expert em MongoDB Beanie, crie um modelo 'Order' com relacionamento para User, incluindo agregações para estatísticas de vendas, índices otimizados, e queries de busca eficientes."

### Subagent: API Testing Expert
Use este agente para testes rápidos e demonstráveis.

**Contexto**: Este projeto foca em testes simples e demonstráveis. Sempre considere:
- Testes pytest async
- Fixtures reutilizáveis
- Cenários de sucesso e erro
- Fácil execução durante demos
- Coverage básico mas eficiente

**Tarefas que este agente pode fazer**:
- Criar testes para novos endpoints
- Implementar fixtures de dados
- Testes de integração simples
- Validação de schemas
- Mock de serviços externos

**Exemplo de prompt**:
"Como um expert em API Testing, crie uma suíte completa de testes para endpoints de e-commerce incluindo: registro de usuário, login, criação de produtos, e processo de checkout. Testes devem ser demonstráveis e rodar rapidamente."

## 🎨 Patterns para Vibecoding

### 1. Service Pattern (Business Logic)
```python
class EntityService:
    @staticmethod
    async def create_entity(data: EntityCreate) -> Entity:
        # 1. Validations
        # 2. Business logic
        # 3. Database operation
        # 4. Return result
        
    @staticmethod
    async def get_entities() -> List[Entity]:
        return await Entity.find().to_list()
```

### 2. Router Pattern (API Endpoints)
```python
router = APIRouter()

@router.post("/", response_model=EntityRead, status_code=201)
async def create_entity(data: EntityCreate):
    return await EntityService.create_entity(data)

@router.get("/", response_model=List[EntityRead])
async def get_entities():
    return await EntityService.get_entities()
```

### 3. Schema Pattern (Validation)
```python
class EntityBase(BaseModel):
    name: str
    description: str

class EntityCreate(EntityBase):
    pass

class EntityRead(EntityBase):
    id: str
    created_at: datetime
```

## 🚀 Vantagens para Vibecoding

### ✅ Rapidez Extrema
- **5 minutos**: CRUD completo para nova entidade
- **10 minutos**: Autenticação JWT funcional
- **15 minutos**: Feature completa com testes

### ✅ Simplicidade Visual
- Estrutura previsível e intuitiva
- Código limpo e demonstrável
- Padrões consistentes em todo projeto

### ✅ Claude Code Friendly
- Padrões claros para subagents
- Templates reutilizáveis
- Arquitetura modular expandível

### ✅ Demo Ready
- Endpoints funcionais imediatamente
- Swagger UI automático
- Testes demonstráveis

## 🎯 Workflow Vibecoding Típico

1. **Defina a entidade** (2 min)
   ```bash
   # "Vamos criar um sistema de Posts"
   touch app/models/post.py
   touch app/schemas/post.py  
   touch app/services/post_service.py
   touch app/api/posts.py
   ```

2. **Implemente o model** (3 min)
   ```python
   class Post(Document):
       title: str
       content: str
       author_id: str
   ```

3. **Crie os schemas** (2 min)
   ```python
   class PostCreate(BaseModel): ...
   class PostRead(BaseModel): ...
   ```

4. **Desenvolva o service** (5 min)
   ```python
   class PostService:
       @staticmethod
       async def create_post(...): ...
   ```

5. **Exponha a API** (3 min)
   ```python
   @router.post("/", response_model=PostRead)
   async def create_post(...): ...
   ```

6. **Teste ao vivo** (2 min)
   ```bash
   # Acesse http://localhost:8000/docs
   # Teste endpoints na interface Swagger
   ```

**Total: 15 minutos para feature completa!** 🎉

## 🤝 Integração com Claude Code

Esta arquitetura foi especificamente projetada para trabalhar perfeitamente com Claude Code subagents:

1. **Estrutura previsível**: Subagents sabem exatamente onde colocar cada código
2. **Padrões consistentes**: Templates claros para replicação
3. **Módulos independentes**: Cada feature pode ser desenvolvida isoladamente
4. **Testes integrados**: Validação automática do código gerado

Use os prompts especializados acima para maximizar a eficiência dos subagents!

---

**🚀 Pronto para vibecoding! Desenvolva APIs rapidamente e impressione sua audiência!**