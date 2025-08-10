# 🚀 FastAPI SQLAlchemy Async Vibecoding Template

## Vibecoding Architecture (Async) - Perfect for Live Coding!

This template follows the **vibecoding** philosophy: simple, modular, demonstrable code perfect for rapid development (15-minute features) and live coding sessions with Claude Code subagents.

## 🏗️ Simple Vibecoding Structure
```
├── app/                   # Main app directory
│   ├── api/              # REST endpoints (async)
│   │   └── users.py      # User endpoints
│   ├── core/             # App core (config, DB)
│   │   ├── database.py   # Async database setup
│   │   └── settings.py   # Environment settings
│   ├── models/           # SQLAlchemy async models
│   │   └── user.py       # User model
│   ├── schemas/          # Pydantic schemas
│   │   └── user.py       # User schemas
│   ├── services/         # Business logic (async)
│   │   └── user_service.py # User service with async CRUD
│   └── main.py          # FastAPI async app
├── tests/               # Async tests
│   └── test_users.py    # User tests with performance demo
└── requirements.txt     # All async dependencies
```

## ⚡ Quick Start Commands
```bash
# Install dependencies
pip install -r requirements.txt

# Run development server  
uvicorn app.main:app --reload

# Run async tests (with performance demo)
pytest tests/test_users.py -v

# Test a complete feature in < 15 minutes!
curl -X POST "http://localhost:8000/users/register" \
     -H "Content-Type: application/json" \
     -d '{"email": "demo@example.com", "password": "demo123", "confirm_password": "demo123"}'
```

## 🔥 Vibecoding Async Patterns  

### Simple Async Service Pattern
Business logic in clean services - perfect for demos:
```python
class UserService:
    @staticmethod
    async def create_user(session: AsyncSession, user_data: UserCreate) -> User:
        # Hash password and create user
        user = User(email=user_data.email, ...)
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user
    
    @staticmethod
    async def authenticate(session: AsyncSession, email: str, password: str) -> Optional[User]:
        # Async authentication logic
        result = await session.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        # Verify password and return user
```

### Clean Async API Endpoints
Endpoints that showcase async power:
```python
@router.post("/register", response_model=UserResponse, status_code=201)
async def register_user(
    user_data: UserCreate, 
    session: AsyncSession = Depends(get_async_session)
) -> UserResponse:
    # Check if user exists (async)
    if await UserService.get_user_by_email(session, user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user (async)
    user = await UserService.create_user(session, user_data)
    return UserResponse.model_validate(user)
```

### Modern Async Database
SQLAlchemy 2.0 with async session management:
```python
async def get_async_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

## 🤖 Claude Code Subagent Prompts

### Vibecoding Async Feature Developer
**Perfect for rapid 15-minute feature development!**

```
You are a Vibecoding Async Expert specializing in FastAPI SQLAlchemy async applications.

CONTEXT: This project uses the vibecoding architecture:
- Simple modular structure: app/{api,core,models,schemas,services}
- Focus on rapid development (5-15 minutes for complete features)  
- Async patterns with SQLAlchemy 2.0
- Service pattern for business logic
- Clean, demonstrable code for live coding

VIBECODING PRINCIPLES:
- Keep it simple and fast
- One service per domain (UserService, PostService, etc.)
- Clean async patterns (async def, await, AsyncSession)
- Modern SQLAlchemy 2.0 select() syntax
- Comprehensive but focused endpoints
- Great for demos and live coding

EXAMPLE TASK:
"Create a complete 'posts' feature with async CRUD operations, user relationships, and proper error handling. Follow the vibecoding service pattern and make it ready to demo in 15 minutes."

WHAT TO INCLUDE:
1. Models (app/models/post.py) 
2. Schemas (app/schemas/post.py)
3. Service (app/services/post_service.py) with async CRUD
4. API endpoints (app/api/posts.py) with full REST API
5. Tests (tests/test_posts.py) with async patterns
```

### Async Database Operations
```python
# Sync version
user = session.query(User).filter(User.email == email).first()

# Async version  
result = await session.execute(select(User).where(User.email == email))
user = result.scalar_one_or_none()
```

### Async Service Methods
```python
# All service methods are async
async def create_user(session: AsyncSession, user_data: UserCreate) -> User:
    # Implementation with await
```

### Async API Endpoints
```python
# All endpoints use async/await
@router.post("/register")
async def register_user(
    user_data: UserCreate, 
    session: AsyncSession = Depends(get_async_session)
):
    user = await UserService.create_user(session, user_data)
    return user
```

## 🔧 Environment Setup

Copy `.env.example` to `.env` and customize:

```bash
# 🚀 FastAPI SQLAlchemy Async Vibecoding Configuration

# App Settings
APP_NAME="FastAPI SQLAlchemy Async Vibecoding"
VERSION="1.0.0"
DEBUG=true

# Async Database (choose one)
# SQLite async (default - great for demos)
DATABASE_URL="sqlite+aiosqlite:///./vibecoding_async.db"

# PostgreSQL async (production ready)
# DATABASE_URL="postgresql+asyncpg://user:password@localhost:5432/vibecoding_db"

# Security (CHANGE IN PRODUCTION!)
SECRET_KEY="your-super-secret-key-change-in-production-please"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🔐 Padrão de Identificadores (Segurança + Performance)

Adotamos o padrão híbrido: `id` (Integer, PK interno sequencial) + `public_id` (UUID v4 exposto externamente) para todos os domínios que precisam ser referenciados via API pública.

### Por que não usar apenas UUID como PK?
- Fragmentação de B-Tree: UUID aleatório degrada locality de páginas → mais cache misses
- Índices maiores: 16 bytes vs 4 bytes (int) → mais RAM / I/O
- JOINs mais lentos: FKs maiores propagam custo em queries compostas
- Armazenamento: Mais páginas de índice → aumento cumulativo em grande escala

### Benefícios do padrão `id` + `public_id`
- Performance: PK pequena, sequencial (ou quase) otimiza inserts e índices
- Segurança: APIs nunca expõem PK incremental (evita enumeration / scraping)
- Evolução: Facilita sharding/future partitioning (UUID pode codificar origem futura)
- Observabilidade: Logs internos usam `id` (legível, compacto); externos usam `public_id`
- Padrão de mercado: Usado em Stripe, GitHub, Segment, etc.

### Diretrizes de Implementação
- Modelos: sempre adicionar `public_id = Column(UUID(...), default=uuid.uuid4, unique=True, index=True, nullable=False)`
- Exposição API: Rotas, schemas de resposta, links e relacionamentos usam `public_id`
- Banco: Nunca criar FKs para `public_id`; relacionamentos internos sempre via inteiro
- Indexes: Manter índice não único em `id` (PK já cria) e índice único em `public_id`
- Logging: Padronizar: `log.info("User fetched", extra={"user_id": user.id, "user_public_id": str(user.public_id)})`

### Padrão de Schemas (Pydantic)
```python
class UserResponse(BaseModel):
    public_id: UUID  # UUID externo exposto como identificador
    email: EmailStr
```
Obs: No schema expomos campo `id` mas é na verdade o `public_id` (documentar claramente). Se for necessário expor ambos para administração, usar `internal_id` / `public_id`.

### Convenção de Nomes
- Banco: `public_id`
- Código: usar `public_id` consistentemente (evitar alias type hints confusos)
- Frontend: Campo serializado como `id` (documentar no contrato) para UX simplificada

### Checklist para Novos Modelos
- [ ] `id` Integer PK
- [ ] `public_id` UUID unique index
- [ ] Índices adicionais necessários
- [ ] Service layer aceita filtros por `public_id`
- [ ] Schemas não vazam `id` interno
- [ ] Teste cobrindo lookup por `public_id`

### Erros Comuns a Evitar
| Erro | Correção |
|------|----------|
| FK criada para `public_id` | Usar sempre FK para `id` |
| Expor `id` interno em resposta | Trocar para `public_id` no schema |
| Usar `public_id` em joins internos | Usar `id` interno |
| Falta de índice em `public_id` | Adicionar índice + unique |

---

## 🎯 Feature Development Guide

### 📋 **Step-by-Step Process for Adding New Features**

Siga este processo rigorosamente para manter a consistência arquitetural vibecoding com SQLAlchemy Async:

#### **1. 📁 Create Feature Structure**
```bash
# Exemplo: Adicionando feature "Products"
mkdir -p app/{models,schemas,services,api}
mkdir -p tests

# Os arquivos específicos da feature
touch app/models/product.py
touch app/schemas/product.py
touch app/services/product_service.py
touch app/api/products.py
touch tests/test_products.py
```

#### **2. 📊 Database Model (SQLAlchemy Async)**
```bash
# 1. Define SQLAlchemy async model with relationships
# app/models/product.py

# 2. Create Alembic migration
alembic revision --autogenerate -m "Add products table"
alembic upgrade head
```

#### **3. 💾 Service Layer (Async Business Logic)**
```bash
# Implemente primeiro o service com toda a lógica de negócios async
# app/services/product_service.py
```

#### **4. 🎨 API Layer (Async FastAPI Router)**
```bash
# 1. Create Pydantic schemas para validation
# 2. Implement async router com endpoints  
# 3. Register router no main app
```

#### **5. 🧪 Testing**
```bash
# Create comprehensive async tests
touch tests/test_products.py
pytest tests/test_products.py -v
```

```
Nova Feature Async?
├── Precisa de relacionamentos?
│   ├── SIM → ForeignKey + relationship() + async joins
│   └── NÃO → Async table simples
├── É extensão de feature existente?
│   ├── SIM → Adicionar aos models async existentes
│   └── NÃO → Criar nova estrutura async completa
├── Queries complexas?
│   ├── SIM → Async joins + subqueries + aggregations
│   └── NÃO → Async query operations simples
├── Performance crítica?
│   ├── SIM → Async indexes compostos + query optimization
│   └── NÃO → Async indexes básicos
```

### 📐 **Async SQLAlchemy Architectural Rules (NEVER BREAK)**

#### **✅ ALWAYS DO:**
1. **Async everywhere**: Todos métodos de database são async
2. **SQLAlchemy 2.0 syntax**: Use select() ao invés de query()
3. **AsyncSession**: Use Depends(get_async_session) sempre
4. **Proper relationships**: ForeignKey + relationship() bem definidos
5. **Migrations**: Alembic para todas mudanças de schema
6. **Async validation**: Pydantic schemas para todos inputs/outputs
7. **Async tests**: Teste todos cenários com async database

#### **❌ NEVER DO:**
1. **Sync operations**: Nunca misture sync e async
2. **Old query() syntax**: Use sempre SQLAlchemy 2.0 select()
3. **Missing await**: Toda operação database precisa de await
4. **Blocking operations**: Evite operações que bloqueiam event loop
5. **Skip async testing**: Toda feature precisa de testes async
6. **No session management**: AsyncSession lifecycle importante
7. **Forget error handling**: Async errors precisam de tratamento específico

### 🔄 **Async SQLAlchemy Reasoning Process**

#### **Before Adding Any Async Feature:**
1. **Define async patterns**: Como será a estrutura async?
2. **Plan async relationships**: Como relacionamentos funcionarão async?
3. **Consider performance**: Async operations são adequadas?
4. **Design async flows**: Como dados fluem pela aplicação?
5. **Think concurrency**: Como lidar com operações concorrentes?

#### **During Async Development:**
1. **Start with async model**: SQLAlchemy async model primeiro
2. **Create migration**: Alembic migration setup
3. **Build async service**: Business logic com AsyncSession
4. **Create async API**: Endpoints com async dependency injection
5. **Write async tests**: Cobertura completa com async database
6. **Test async patterns**: Verificar comportamento assíncrono

#### **After Async Implementation:**
1. **Test async manually**: Use FastAPI docs interface
2. **Check async performance**: Verifique concurrent requests
3. **Run async tests**: pytest com async database test
4. **Monitor async behavior**: Async performance patterns
5. **Async migration test**: Fresh database + async operations

### 🎯 **Async SQLAlchemy Feature Checklist**

Antes de considerar a feature async "completa":

- [ ] **Async Model**: SQLAlchemy async model criado com relationships?
- [ ] **Migration**: Alembic migration aplicada?
- [ ] **Async Service**: Business logic async implementada?
- [ ] **Async API**: Endpoints async com dependency injection funcionando?
- [ ] **Schemas**: Pydantic schemas definidos?
- [ ] **Async Tests**: Todos endpoints testados async com database?
- [ ] **Indexes**: Performance async queries otimizada?
- [ ] **Async Error handling**: Casos de erro async tratados?
- [ ] **Documentation**: FastAPI async docs funcionando?
- [ ] **Async Relationships**: Foreign keys async funcionando?

### 💡 **Async SQLAlchemy Pro Tips for Claude Code**

1. **Start with async everywhere**: Não misture sync/async patterns
2. **Use SQLAlchemy 2.0**: select() syntax é mais clara e async-friendly
3. **Plan session lifecycle**: AsyncSession management é crítico
4. **Test concurrency**: Verifique comportamento com múltiplas requests
5. **Monitor performance**: Async pode ser mais rápido mas com overhead
6. **Use proper typing**: AsyncSession typing é importante

### 📊 **Async SQLAlchemy Example Templates**

#### **Async Service Template**
```python
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.feature import Feature
from ..schemas.feature import FeatureCreate, FeatureUpdate
from fastapi import HTTPException

class FeatureService:
    @staticmethod
    async def create_feature(session: AsyncSession, feature_data: FeatureCreate) -> Feature:
        # Check if already exists (async)
        result = await session.execute(select(Feature).where(Feature.name == feature_data.name))
        existing = result.scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=400, detail="Feature already exists")
        
        # Create new feature (async)
        db_feature = Feature(**feature_data.model_dump())
        session.add(db_feature)
        await session.commit()
        await session.refresh(db_feature)
        return db_feature
    
    @staticmethod
    async def get_features(session: AsyncSession, skip: int = 0, limit: int = 100) -> List[Feature]:
        result = await session.execute(select(Feature).offset(skip).limit(limit))
        return result.scalars().all()
    
    @staticmethod
    async def get_feature_by_id(session: AsyncSession, feature_id: int) -> Optional[Feature]:
        result = await session.execute(select(Feature).where(Feature.id == feature_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def update_feature(session: AsyncSession, feature_id: int, feature_data: FeatureUpdate) -> Optional[Feature]:
        result = await session.execute(select(Feature).where(Feature.id == feature_id))
        db_feature = result.scalar_one_or_none()
        if not db_feature:
            return None
            
        update_data = feature_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_feature, field, value)
            
        await session.commit()
        await session.refresh(db_feature)
        return db_feature
    
    @staticmethod
    async def delete_feature(session: AsyncSession, feature_id: int) -> bool:
        result = await session.execute(select(Feature).where(Feature.id == feature_id))
        db_feature = result.scalar_one_or_none()
        if not db_feature:
            return False
            
        await session.delete(db_feature)
        await session.commit()
        return True
```

#### **Async API Router Template**  
```python
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from ..core.database import get_async_session
from ..schemas.feature import FeatureCreate, FeatureRead, FeatureUpdate
from ..services.feature_service import FeatureService

router = APIRouter(prefix="/features", tags=["features"])

@router.post("/", response_model=FeatureRead, status_code=status.HTTP_201_CREATED)
async def create_feature(
    feature_data: FeatureCreate, 
    session: AsyncSession = Depends(get_async_session)
):
    """Create a new feature (async)"""
    return await FeatureService.create_feature(session, feature_data)

@router.get("/", response_model=List[FeatureRead])
async def get_features(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    session: AsyncSession = Depends(get_async_session)
):
    """Get list of features with pagination (async)"""
    return await FeatureService.get_features(session, skip=skip, limit=limit)

@router.get("/{feature_id}", response_model=FeatureRead)
async def get_feature(
    feature_id: int, 
    session: AsyncSession = Depends(get_async_session)
):
    """Get a specific feature by ID (async)"""
    feature = await FeatureService.get_feature_by_id(session, feature_id)
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    return feature

@router.put("/{feature_id}", response_model=FeatureRead)
async def update_feature(
    feature_id: int, 
    feature_data: FeatureUpdate, 
    session: AsyncSession = Depends(get_async_session)
):
    """Update an existing feature (async)"""
    feature = await FeatureService.update_feature(session, feature_id, feature_data)
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    return feature

@router.delete("/{feature_id}")
async def delete_feature(
    feature_id: int, 
    session: AsyncSession = Depends(get_async_session)
):
    """Delete a feature (async)"""
    success = await FeatureService.delete_feature(session, feature_id)
    if not success:
        raise HTTPException(status_code=404, detail="Feature not found")
    return {"message": "Feature deleted successfully"}
```

#### **Async Test Template**
```python
import pytest
from httpx import AsyncClient
from ..main import app

@pytest.mark.asyncio
async def test_create_feature():
    """Test creating a feature (async)"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/features/", json={
            "name": "Test Feature",
            "description": "Test description",
            "priority": 3
        })
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Feature"
    assert data["priority"] == 3
    assert "id" in data
    assert "created_at" in data

@pytest.mark.asyncio
async def test_get_features():
    """Test getting features list (async)"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/features/")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

@pytest.mark.asyncio
async def test_get_feature_not_found():
    """Test getting non-existent feature (async)"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/features/999")
    
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]
```

### Princípios
1. Mensagens de erro para o cliente devem ser genéricas em falhas 5xx.
2. Detalhes completos (stack trace, payload sanitizado, IDs de correlação) vão apenas para o log.
3. Nunca logar: senhas, tokens JWT, secrets, dados pessoais completos.
4. Adotar nível adequado: `info` (fluxo normal), `warning` (anomalia recuperável), `error` (falha negócio), `exception` (falha inesperada). 

### Anti-Patterns (NÃO FAZER)
| Anti-Pattern | Risco |
|--------------|-------|
| `detail=f"Erro: {e}"` em HTTP 500 | Vazamento de stack/infra | 
| Logar `password` ou `confirm_password` | Exposição de credencial |
| Logar token JWT completo | Reutilização / sequestro de sessão |
| Levantar Exception crua sem handler global | Retorno 500 inconsistente |
| Usar print() em vez de logging | Perda de contexto / centralização |

### Padrão Recomendado (Exemplo Endpoint)
```python
try:
    return await ChatService.process_message(session, message_data)
except HTTPException:
    raise  # erros controlados mantêm a mensagem de domínio
except Exception as e:
    logger.exception(
        "chat.unexpected_error",
        extra={
            "session_public_id": str(message_data.session_public_id or message_data.session_id or ""),
            "channel": message_data.channel,
            error: e
        }
    )
    raise HTTPException(status_code=500, detail="Erro interno do servidor.")
```

> Toda nova rota deve seguir este padrão antes de ir para produção.