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

## 🎯 Feature Development Guide

### 📋 **Step-by-Step Process for Adding New Features**

Siga este processo rigorosamente para manter a consistência arquitetural vibecoding com SQLAlchemy:

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

#### **2. 📊 Database Model (SQLAlchemy)**
```bash
# 1. Define SQLAlchemy model with relationships
# app/models/product.py

# 2. Create Alembic migration
alembic revision --autogenerate -m "Add products table"
alembic upgrade head
```

#### **3. 💾 Service Layer (Business Logic)**
```bash
# Implemente primeiro o service com toda a lógica de negócios
# app/services/product_service.py
```

#### **4. 🎨 API Layer (FastAPI Router)**
```bash
# 1. Create Pydantic schemas para validation
# 2. Implement router com endpoints  
# 3. Register router no main app
```

#### **5. 🧪 Testing**
```bash
# Create comprehensive tests
touch tests/test_products.py
pytest tests/test_products.py -v
```

### 🤖 **Claude Code Prompt Templates**

#### **📝 Complete SQLAlchemy CRUD Feature Prompt**
```
Você é um especialista em FastAPI SQLAlchemy Vibecoding API development.

TAREFA: Criar a feature "Products" completa seguindo nossa arquitetura vibecoding SQLAlchemy.

ARQUITETURA OBRIGATÓRIA:
app/
├── models/product.py (SQLAlchemy model + relationships)
├── schemas/product.py (Pydantic schemas para validation)
├── services/product_service.py (business logic + database operations)
├── api/products.py (FastAPI router + endpoints)
└── tests/test_products.py (comprehensive tests)

REQUISITOS TÉCNICOS:
✅ SQLAlchemy model com proper relationships
✅ Pydantic schemas para validation automática
✅ FastAPI automatic documentation
✅ Error handling com proper HTTP codes
✅ Database operations (CRUD) com Session
✅ Dependency injection com get_db
✅ Testes com 100% de cobertura dos endpoints
✅ Alembic migration para database schema

FUNCIONALIDADES:
- GET /products (list with pagination, filters)
- GET /products/{id} (get by ID)
- POST /products (create with validation)
- PUT /products/{id} (update)
- DELETE /products/{id} (delete)
- GET /products/category/{category_id} (products by category)

SQLALCHEMY MODEL NECESSÁRIO:
```python
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text)
    price = Column(Float, nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    in_stock = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    category = relationship("Category", back_populates="products")
```

PADRÕES SQLALCHEMY VIBECODING:
- Service class com métodos estáticos usando Session
- Proper error handling com HTTPException
- Database transactions para operações complexas
- Relationships bem definidas
- Testes usando TestClient com database

ENTREGUE: Código completo de todos os arquivos + migration.
```

#### **📱 Simple SQLAlchemy Feature Prompt**
```
TAREFA: Criar feature "Categories" simples com SQLAlchemy.

ARQUITETURA MÍNIMA:
- app/models/category.py (SQLAlchemy model)
- app/schemas/category.py (Pydantic schemas)
- app/services/category_service.py (basic CRUD)
- app/api/categories.py (FastAPI router)
- tests/test_categories.py (basic tests)

FUNCIONALIDADES:
- CRUD básico (Create, Read, Update, Delete)
- Validação com Pydantic
- Database indexes básicos
- Testes essenciais

NÃO PRECISA: Relacionamentos complexos, business logic avançada.
```

#### **🔄 Extend Existing Feature Prompt**
```
TAREFA: Adicionar "Reviews" à feature Products existente.

MODIFICAÇÕES NECESSÁRIAS:

1. app/models/review.py
   - Criar Review model com ForeignKey para Product e User

2. app/models/product.py
   - Adicionar relationship("Review", back_populates="product")

3. app/services/product_service.py
   - Adicionar get_product_reviews(db, product_id)
   - Adicionar add_review(db, product_id, review_data)

4. app/api/products.py
   - GET /products/{id}/reviews
   - POST /products/{id}/reviews

5. app/schemas/product.py
   - Adicionar Review schemas
   - Estender ProductRead com reviews

6. tests/test_products.py
   - Adicionar testes para review endpoints

7. Alembic migration
   - alembic revision --autogenerate -m "Add reviews table"

MANTENHA: Arquitetura SQLAlchemy existente, foreign keys, indexes.
```

### 🏗️ **SQLAlchemy Architecture Decision Tree**

```
Nova Feature?
├── Precisa de relacionamentos?
│   ├── SIM → ForeignKey + relationship() + joins
│   └── NÃO → Table simples
├── É extensão de feature existente?
│   ├── SIM → Adicionar aos models existentes
│   └── NÃO → Criar nova estrutura completa
├── Queries complexas?
│   ├── SIM → Joins + subqueries + aggregations
│   └── NÃO → Query operations simples
├── Performance crítica?
│   ├── SIM → Indexes compostos + query optimization
│   └── NÃO → Indexes básicos
```

### 📐 **SQLAlchemy Architectural Rules (NEVER BREAK)**

#### **✅ ALWAYS DO:**
1. **Model structure**: Use SQLAlchemy models para todos tables
2. **Proper relationships**: ForeignKey + relationship() bem definidos
3. **Database sessions**: Use Depends(get_db) sempre
4. **Migrations**: Alembic para todas mudanças de schema
5. **Pydantic validation**: Schemas para todos inputs/outputs
6. **Service pattern**: Business logic separada em services
7. **Comprehensive tests**: Teste todos cenários com database real

#### **❌ NEVER DO:**
1. **Skip migrations**: SQLAlchemy sem Alembic é arriscado
2. **Direct session access**: Use sempre dependency injection
3. **Missing relationships**: Foreign keys sem relationship()
4. **No indexes**: Performance queries importante
5. **Skip validation**: Todo input deve ser validado
6. **Skip error handling**: Trate todos os casos de database
7. **No tests**: Toda feature precisa de testes com DB

### 🔄 **SQLAlchemy Reasoning Process**

#### **Before Adding Any Feature:**
1. **Define table structure**: Que colunas são necessárias?
2. **Plan relationships**: Como conecta com outras tabelas?
3. **Consider indexes**: Quais campos serão consultados?
4. **Design constraints**: Unique, nullable, defaults
5. **Think migrations**: Como migrar dados existentes?

#### **During Development:**
1. **Start with model**: SQLAlchemy model primeiro
2. **Create migration**: Alembic migration setup
3. **Build service**: Business logic com proper sessions
4. **Create API**: Endpoints com dependency injection
5. **Write tests**: Cobertura completa com database
6. **Test migrations**: Up e down funcionando

#### **After Implementation:**
1. **Test manually**: Use FastAPI docs interface
2. **Check relationships**: Verifique joins funcionando
3. **Run all tests**: pytest com database test
4. **Performance check**: Query execution plans
5. **Migration test**: Fresh database + migration

### 🎯 **SQLAlchemy Feature Checklist**

Antes de considerar a feature "completa":

- [ ] **Model**: SQLAlchemy model criado com relationships?
- [ ] **Migration**: Alembic migration aplicada?
- [ ] **Service**: Business logic implementada?
- [ ] **API**: Endpoints com dependency injection funcionando?
- [ ] **Schemas**: Pydantic schemas definidos?
- [ ] **Tests**: Todos endpoints testados com database?
- [ ] **Indexes**: Performance queries otimizada?
- [ ] **Error handling**: Casos de erro de DB tratados?
- [ ] **Documentation**: FastAPI docs funcionando?
- [ ] **Relationships**: Foreign keys funcionando?

### 💡 **SQLAlchemy Pro Tips for Claude Code**

1. **Start with model definition**: Estrutura de tabela clara primeiro
2. **Plan relationships early**: ForeignKey + relationship() desde início
3. **Use Alembic religiously**: Toda mudança via migration
4. **Leverage SQLAlchemy features**: Relationships, lazy loading, etc.
5. **Test with real database**: SQLite para desenvolvimento
6. **Monitor query performance**: Use SQLAlchemy echo=True

### 📊 **SQLAlchemy Example Templates**

#### **Service Template**
```python
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.feature import Feature
from ..schemas.feature import FeatureCreate, FeatureUpdate
from fastapi import HTTPException

class FeatureService:
    @staticmethod
    def create_feature(db: Session, feature_data: FeatureCreate) -> Feature:
        # Check if already exists
        existing = db.query(Feature).filter(Feature.name == feature_data.name).first()
        if existing:
            raise HTTPException(status_code=400, detail="Feature already exists")
        
        # Create new feature
        db_feature = Feature(**feature_data.model_dump())
        db.add(db_feature)
        db.commit()
        db.refresh(db_feature)
        return db_feature
    
    @staticmethod
    def get_features(db: Session, skip: int = 0, limit: int = 100) -> List[Feature]:
        return db.query(Feature).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_feature_by_id(db: Session, feature_id: int) -> Optional[Feature]:
        return db.query(Feature).filter(Feature.id == feature_id).first()
    
    @staticmethod
    def update_feature(db: Session, feature_id: int, feature_data: FeatureUpdate) -> Optional[Feature]:
        db_feature = db.query(Feature).filter(Feature.id == feature_id).first()
        if not db_feature:
            return None
            
        update_data = feature_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_feature, field, value)
            
        db.commit()
        db.refresh(db_feature)
        return db_feature
    
    @staticmethod
    def delete_feature(db: Session, feature_id: int) -> bool:
        db_feature = db.query(Feature).filter(Feature.id == feature_id).first()
        if not db_feature:
            return False
            
        db.delete(db_feature)
        db.commit()
        return True
```

#### **API Router Template**  
```python
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from ..core.database import get_db
from ..schemas.feature import FeatureCreate, FeatureRead, FeatureUpdate
from ..services.feature_service import FeatureService

router = APIRouter(prefix="/features", tags=["features"])

@router.post("/", response_model=FeatureRead, status_code=status.HTTP_201_CREATED)
def create_feature(feature_data: FeatureCreate, db: Session = Depends(get_db)):
    """Create a new feature"""
    return FeatureService.create_feature(db, feature_data)

@router.get("/", response_model=List[FeatureRead])
def get_features(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get list of features with pagination"""
    return FeatureService.get_features(db, skip=skip, limit=limit)

@router.get("/{feature_id}", response_model=FeatureRead)
def get_feature(feature_id: int, db: Session = Depends(get_db)):
    """Get a specific feature by ID"""
    feature = FeatureService.get_feature_by_id(db, feature_id)
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    return feature

@router.put("/{feature_id}", response_model=FeatureRead)
def update_feature(
    feature_id: int, 
    feature_data: FeatureUpdate, 
    db: Session = Depends(get_db)
):
    """Update an existing feature"""
    feature = FeatureService.update_feature(db, feature_id, feature_data)
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    return feature

@router.delete("/{feature_id}")
def delete_feature(feature_id: int, db: Session = Depends(get_db)):
    """Delete a feature"""
    success = FeatureService.delete_feature(db, feature_id)
    if not success:
        raise HTTPException(status_code=404, detail="Feature not found")
    return {"message": "Feature deleted successfully"}
```

#### **SQLAlchemy Model Template**
```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base
from enum import Enum

class FeatureStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"

class Feature(Base):
    __tablename__ = "features"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text)
    status = Column(String(20), default=FeatureStatus.ACTIVE.value, nullable=False)
    priority = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Optional relationships
    # items = relationship("Item", back_populates="feature")
    
    def __repr__(self):
        return f"<Feature(id={self.id}, name='{self.name}', status='{self.status}')>"
```

#### **Pydantic Schema Template**
```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class FeatureStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"

class FeatureBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    status: FeatureStatus = FeatureStatus.ACTIVE
    priority: int = Field(default=1, ge=1, le=5)

class FeatureCreate(FeatureBase):
    pass

class FeatureUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    status: Optional[FeatureStatus] = None
    priority: Optional[int] = Field(None, ge=1, le=5)

class FeatureRead(FeatureBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
```

### 🎯 **SQLAlchemy Performance Benefits**

#### **🚀 Relational Database Advantages**
- ACID transactions guaranteed
- Complex joins and relationships
- Mature query optimization
- Data integrity constraints

#### **📚 SQLAlchemy ORM Benefits**
- Pythonic database operations
- Automatic relationship loading
- Migration system with Alembic
- Connection pooling built-in

#### **🎨 Vibecoding with SQLAlchemy**
- Familiar SQL concepts
- Rich relationship modeling
- Powerful query capabilities
- Production-ready patterns

Ready to vibecode your next relational API! ⚡

---

**🚀 Pronto para vibecoding com bancos relacionais! Desenvolva APIs rapidamente e impressione sua audiência com dados reais!**