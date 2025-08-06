# FastAPI SQLAlchemy Vibecoding Template

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
├── core/                  # ⚙️ Configurações e banco de dados
│   ├── __init__.py
│   ├── config.py         # Settings com Pydantic
│   ├── database.py       # SQLAlchemy setup
│   └── security.py       # JWT, hashing, auth
├── models/                # 📄 SQLAlchemy Models
│   ├── __init__.py
│   └── user.py           # Exemplo: User model
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

# 📊 Database migrations (opcional)
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## 🎯 Exemplo Prático: API Users

### 1. Model (SQLAlchemy)
```python
# app/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from ..core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
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
    id: int
    username: str
    email: EmailStr
    is_active: bool
    
    class Config:
        from_attributes = True
```

### 3. Service (Business Logic)
```python
# app/services/user_service.py
from sqlalchemy.orm import Session

class UserService:
    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        # Validations + hashing + create
        hashed_password = get_password_hash(user_data.password)
        db_user = User(username=user_data.username, ...)
        db.add(db_user)
        db.commit()
        return db_user
```

### 4. API Routes (FastAPI Router)
```python
# app/api/users.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..services.user_service import UserService

router = APIRouter()

@router.post("/register", response_model=UserRead, status_code=201)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    return UserService.create_user(db, user_data)

@router.get("/", response_model=List[UserRead])
def get_users(db: Session = Depends(get_db)):
    return UserService.get_users(db)
```

## 🤖 Prompts Claude Code para Vibecoding

### Subagent: FastAPI SQLAlchemy Vibecoding Expert
Use este agente para desenvolvimento rápido de APIs com SQLAlchemy.

**Contexto**: Este projeto usa estrutura simples para vibecoding com FastAPI + SQLAlchemy. Sempre considere:
- Arquitetura modular simples (api, core, models, schemas, services)
- SQLAlchemy ORM para bancos relacionais
- Pydantic para validação automática
- Dependency injection com get_db
- Código limpo e demonstrável
- Padrões previsíveis para rápida expansão

**Tarefas que este agente pode fazer**:
- Criar CRUD completo para novas entidades (5 minutos)
- Implementar relacionamentos SQLAlchemy
- Adicionar validações e schemas Pydantic
- Criar testes básicos para demonstrações
- Configurar migrações Alembic

**Exemplo de prompt**:
"Como um expert em FastAPI SQLAlchemy Vibecoding, implemente um CRUD completo para 'posts' incluindo: SQLAlchemy model com relacionamento para User, Pydantic schemas, service com business logic, API routes, e testes básicos. Estrutura deve ser idêntica ao users.py existente."

### Subagent: SQLAlchemy Relationships Expert
Use este agente para modelagem de dados relacionais.

**Contexto**: Este projeto usa SQLAlchemy ORM com bancos relacionais. Sempre considere:
- Relacionamentos foreign key bem definidos
- Índices para performance
- Constraints para integridade
- Lazy loading para queries eficientes
- Migrations automáticas com Alembic

**Tarefas que este agente pode fazer**:
- Criar models com relacionamentos complexos
- Implementar one-to-many, many-to-many
- Otimizar queries com joins
- Configurar índices apropriados
- Criar migrations incrementais

**Exemplo de prompt**:
"Como um expert em SQLAlchemy Relationships, crie um modelo 'Order' com relacionamento many-to-one para User, one-to-many para OrderItems, incluindo foreign keys, índices otimizados, e queries eficientes para relatórios de vendas."

### Subagent: Database Testing Expert
Use este agente para testes com bancos de dados.

**Contexto**: Este projeto foca em testes com SQLAlchemy e bancos temporários. Sempre considere:
- SQLite in-memory para testes rápidos
- Fixtures para dados de teste
- Database rollback entre testes
- Mocking de dependencies
- Coverage de cenários de erro

**Tarefas que este agente pode fazer**:
- Criar testes para novos endpoints com DB
- Implementar fixtures de dados relacionais
- Testes de integridade referencial
- Validação de constraints
- Performance testing de queries

**Exemplo de prompt**:
"Como um expert em Database Testing, crie uma suíte completa de testes para um sistema de blog incluindo: testes de relacionamentos User-Post-Comment, validação de constraints, testes de performance para queries com joins, e fixtures reutilizáveis."

## 🎨 Patterns para Vibecoding

### 1. Service Pattern (Business Logic)
```python
class EntityService:
    @staticmethod
    def create_entity(db: Session, data: EntityCreate) -> Entity:
        # 1. Validations
        existing = db.query(Entity).filter(Entity.name == data.name).first()
        if existing:
            raise HTTPException(400, "Already exists")
            
        # 2. Business logic
        db_entity = Entity(**data.model_dump())
        
        # 3. Database operation
        db.add(db_entity)
        db.commit()
        db.refresh(db_entity)
        
        # 4. Return result
        return db_entity
        
    @staticmethod
    def get_entities(db: Session, skip: int = 0, limit: int = 100) -> List[Entity]:
        return db.query(Entity).offset(skip).limit(limit).all()
```

### 2. Router Pattern (API Endpoints)
```python
router = APIRouter()

@router.post("/", response_model=EntityRead, status_code=201)
def create_entity(data: EntityCreate, db: Session = Depends(get_db)):
    return EntityService.create_entity(db, data)

@router.get("/", response_model=List[EntityRead])
def get_entities(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return EntityService.get_entities(db, skip, limit)
```

### 3. Model Pattern (SQLAlchemy)
```python
class Entity(Base):
    __tablename__ = "entities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    items = relationship("Item", back_populates="entity")
```

## 🚀 Vantagens para Vibecoding

### ✅ Rapidez Extrema
- **5 minutos**: CRUD completo para nova entidade
- **10 minutos**: Relacionamentos SQLAlchemy funcionais
- **15 minutos**: Feature completa com testes e migrações

### ✅ Banco de Dados Real
- **SQLite**: Zero config, perfeito para demos
- **PostgreSQL**: Production ready
- **MySQL**: Alternativa robusta
- **Migrations**: Versionamento automático

### ✅ Simplicidade Visual
- Estrutura previsível e intuitiva
- Código SQL familiar e demonstrável
- Padrões relacionais tradicionais

### ✅ Claude Code Friendly
- Padrões claros para subagents
- Templates reutilizáveis
- Arquitetura modular expandível

### ✅ Demo Ready
- Endpoints funcionais imediatamente
- Swagger UI com exemplos
- Testes demonstráveis com dados reais

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
   class Post(Base):
       __tablename__ = "posts"
       id = Column(Integer, primary_key=True)
       title = Column(String(200), nullable=False)
       content = Column(Text)
       author_id = Column(Integer, ForeignKey("users.id"))
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
       def create_post(db: Session, ...): ...
   ```

5. **Exponha a API** (3 min)
   ```python
   @router.post("/", response_model=PostRead)
   def create_post(data: PostCreate, db: Session = Depends(get_db)): ...
   ```

6. **Teste ao vivo** (2 min)
   ```bash
   # Acesse http://localhost:8000/docs
   # Teste endpoints na interface Swagger
   # Veja dados reais no banco SQLite
   ```

**Total: 15 minutos para feature completa!** 🎉

## 💾 Database Features

### SQLite (Default)
- ✅ **Zero configuration** - Perfeito para demos
- ✅ **File-based** - Fácil de backup e compartilhar
- ✅ **Lightning fast** - Ideal para desenvolvimento
- ✅ **SQL standard** - Queries familiares

### PostgreSQL (Production)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/vibecoding_db"
```

### MySQL (Alternative)
```env
DATABASE_URL="mysql+pymysql://user:password@localhost:3306/vibecoding_db"
```

### Alembic Migrations
```bash
# Auto-generate migration
alembic revision --autogenerate -m "Add posts table"

# Apply migration
alembic upgrade head

# Downgrade if needed
alembic downgrade -1
```

## 🤝 Integração com Claude Code

Esta arquitetura foi especificamente projetada para trabalhar perfeitamente com Claude Code subagents:

1. **Estrutura previsível**: Subagents sabem exatamente onde colocar cada código
2. **Padrões relacionais**: Templates claros para models e relacionamentos
3. **SQL familiar**: Queries e estruturas que subagents conhecem bem
4. **Testes integrados**: Validação automática com dados reais

Use os prompts especializados acima para maximizar a eficiência dos subagents!

---

**🚀 Pronto para vibecoding com bancos relacionais! Desenvolva APIs rapidamente e impressione sua audiência com dados reais!**