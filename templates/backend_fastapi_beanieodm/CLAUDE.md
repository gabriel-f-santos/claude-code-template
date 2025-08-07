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

## 🎯 Feature Development Guide

### 📋 **Step-by-Step Process for Adding New Features**

Siga este processo rigorosamente para manter a consistência arquitetural vibecoding com Beanie ODM:

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

#### **2. 📊 Domain Model (Beanie Document)**
```bash
# 1. Define Beanie Document with MongoDB indexes
# app/models/product.py

# 2. Register document in database initialization
# Update app/core/database.py to include new model
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

#### **📝 Complete Beanie CRUD Feature Prompt**
```
Você é um especialista em FastAPI Beanie ODM Vibecoding API development.

TAREFA: Criar a feature "Products" completa seguindo nossa arquitetura vibecoding Beanie.

ARQUITETURA OBRIGATÓRIA:
app/
├── models/product.py (Beanie Document + MongoDB indexes)
├── schemas/product.py (Pydantic schemas para validation)
├── services/product_service.py (business logic + Document operations)
├── api/products.py (FastAPI router + endpoints)
└── tests/test_products.py (comprehensive tests)

REQUISITOS TÉCNICOS:
✅ Beanie Document com proper indexing
✅ Pydantic schemas para validation automática
✅ FastAPI automatic documentation
✅ Error handling com proper HTTP codes
✅ MongoDB operations (find, insert, update, delete)
✅ Async/await em todas operações
✅ Testes com 100% de cobertura dos endpoints

FUNCIONALIDADES:
- GET /products (list with pagination, filters)
- GET /products/{id} (get by ID)
- POST /products (create with validation)
- PUT /products/{id} (update)
- DELETE /products/{id} (delete)
- GET /products/search (search by name/category)

BEANIE DOCUMENT NECESSÁRIO:
```python
from beanie import Document, Indexed
from pydantic import Field
from typing import Optional
from datetime import datetime

class Product(Document):
    name: Indexed(str) = Field(..., min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: float = Field(..., gt=0)
    category: Indexed(str) = Field(..., min_length=2, max_length=50)
    in_stock: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "products"
        indexes = [
            [("name", 1), ("category", 1)],  # Compound index
            "price",
            "created_at"
        ]
```

PADRÕES BEANIE VIBECODING:
- Service class com métodos async estáticos
- Document operations com Beanie syntax
- Proper error handling com HTTPException
- Indexes para performance
- Testes usando motor test database

ENTREGUE: Código completo de todos os arquivos + database setup.
```

#### **📱 Simple Beanie Feature Prompt**
```
TAREFA: Criar feature "Categories" simples com Beanie ODM.

ARQUITETURA MÍNIMA:
- app/models/category.py (Beanie Document)
- app/schemas/category.py (Pydantic schemas)
- app/services/category_service.py (basic CRUD)
- app/api/categories.py (FastAPI router)
- tests/test_categories.py (basic tests)

FUNCIONALIDADES:
- CRUD básico (Create, Read, Update, Delete)
- Validação com Pydantic
- MongoDB indexes básicos
- Testes essenciais

NÃO PRECISA: Relacionamentos complexos, business logic avançada.
```

#### **🔄 Extend Existing Feature Prompt**
```
TAREFA: Adicionar "Reviews" à feature Products existente.

MODIFICAÇÕES NECESSÁRIAS:

1. app/models/review.py
   - Criar Review document com product_id reference

2. app/models/product.py
   - Adicionar campo average_rating (opcional)
   - Método para calcular rating médio

3. app/services/product_service.py
   - Adicionar get_product_reviews(product_id)
   - Adicionar add_review(product_id, review_data)
   - Update rating calculation

4. app/api/products.py
   - GET /products/{id}/reviews
   - POST /products/{id}/reviews
   - Incluir reviews em product detail

5. app/schemas/product.py
   - Adicionar Review schemas
   - Estender ProductRead com reviews

6. tests/test_products.py
   - Adicionar testes para review endpoints

MANTENHA: Arquitetura Beanie existente, indexes eficientes.
```

### 🏗️ **Beanie Architecture Decision Tree**

```
Nova Feature?
├── Precisa de relacionamentos?
│   ├── SIM → ObjectId references + aggregation pipelines
│   └── NÃO → Document simples
├── É extensão de feature existente?
│   ├── SIM → Adicionar aos documentos existentes
│   └── NÃO → Criar nova estrutura completa
├── Queries complexas?
│   ├── SIM → Aggregation framework + indexes
│   └── NÃO → Find operations simples
├── Performance crítica?
│   ├── SIM → Indexes compostos + query optimization
│   └── NÃO → Indexes básicos
```

### 📐 **Beanie Architectural Rules (NEVER BREAK)**

#### **✅ ALWAYS DO:**
1. **Document structure**: Use Beanie Documents para todos models
2. **Proper indexing**: Adicione indexes para campos de busca
3. **Async operations**: Todas operações database são async
4. **Error handling**: Use HTTPException para API errors
5. **Pydantic validation**: Schemas para todos inputs/outputs
6. **Service pattern**: Business logic separada em services
7. **Comprehensive tests**: Teste todos cenários

#### **❌ NEVER DO:**
1. **Skip indexes**: MongoDB sem indexes é lento
2. **Sync operations**: Nunca use operações síncronas
3. **Direct Document in API**: Use sempre services
4. **Missing validation**: Todo input deve ser validado
5. **Hardcoded ObjectIds**: Use proper references
6. **Skip error handling**: Trate todos os casos
7. **No tests**: Toda feature precisa de testes

### 🔄 **Beanie Reasoning Process**

#### **Before Adding Any Feature:**
1. **Define document structure**: Que campos são necessários?
2. **Plan indexes**: Quais campos serão consultados frequentemente?
3. **Consider relationships**: Precisa referenciar outros documents?
4. **Design queries**: Como os dados serão acessados?
5. **Think performance**: Aggregations ou queries simples?

#### **During Development:**
1. **Start with document**: Beanie Document primeiro
2. **Add indexes**: Performance desde o início
3. **Build service**: Business logic bem estruturada
4. **Create API**: Endpoints com proper validation
5. **Write tests**: Cobertura completa
6. **Test performance**: Verificar query efficiency

#### **After Implementation:**
1. **Test manually**: Use FastAPI docs interface
2. **Check indexes**: Verifique query performance
3. **Run all tests**: pytest com coverage
4. **Monitor queries**: Use MongoDB Compass
5. **Security review**: Validação e sanitização

### 🎯 **Beanie Feature Checklist**

Antes de considerar a feature "completa":

- [ ] **Document**: Beanie model criado com indexes?
- [ ] **Service**: Business logic implementada?
- [ ] **API**: Endpoints com validation funcionando?
- [ ] **Schemas**: Pydantic schemas definidos?
- [ ] **Tests**: Todos endpoints testados?
- [ ] **Indexes**: Performance queries otimizada?
- [ ] **Error handling**: Casos de erro tratados?
- [ ] **Documentation**: FastAPI docs funcionando?
- [ ] **Integration**: Registrado no app principal?

### 💡 **Beanie Pro Tips for Claude Code**

1. **Start with Document definition**: Estrutura clara primeiro
2. **Plan indexes early**: Performance desde o início
3. **Use aggregation pipelines**: Para queries complexas
4. **Leverage Beanie features**: Relations, validators, etc.
5. **Test with real MongoDB**: Não apenas in-memory
6. **Monitor query performance**: Use explain() quando necessário

### 📊 **Beanie Example Templates**

#### **Service Template**
```python
from typing import List, Optional
from beanie import PydanticObjectId
from ..models.feature import Feature
from ..schemas.feature import FeatureCreate, FeatureUpdate

class FeatureService:
    @staticmethod
    async def create_feature(feature_data: FeatureCreate) -> Feature:
        feature_dict = feature_data.model_dump()
        feature = Feature(**feature_dict)
        await feature.insert()
        return feature
    
    @staticmethod
    async def get_features(skip: int = 0, limit: int = 100) -> List[Feature]:
        return await Feature.find().skip(skip).limit(limit).to_list()
    
    @staticmethod
    async def get_feature_by_id(feature_id: PydanticObjectId) -> Optional[Feature]:
        return await Feature.get(feature_id)
    
    @staticmethod
    async def update_feature(feature_id: PydanticObjectId, feature_data: FeatureUpdate) -> Optional[Feature]:
        feature = await Feature.get(feature_id)
        if not feature:
            return None
            
        update_data = feature_data.model_dump(exclude_unset=True)
        await feature.update({"$set": update_data})
        return feature
    
    @staticmethod
    async def delete_feature(feature_id: PydanticObjectId) -> bool:
        feature = await Feature.get(feature_id)
        if not feature:
            return False
            
        await feature.delete()
        return True
```

#### **API Router Template**  
```python
from fastapi import APIRouter, HTTPException, status, Query
from typing import List
from beanie import PydanticObjectId

from ..schemas.feature import FeatureCreate, FeatureRead, FeatureUpdate
from ..services.feature_service import FeatureService

router = APIRouter(prefix="/features", tags=["features"])

@router.post("/", response_model=FeatureRead, status_code=status.HTTP_201_CREATED)
async def create_feature(feature_data: FeatureCreate):
    """Create a new feature"""
    try:
        feature = await FeatureService.create_feature(feature_data)
        return FeatureRead.model_validate(feature.model_dump())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[FeatureRead])
async def get_features(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
):
    """Get list of features with pagination"""
    features = await FeatureService.get_features(skip=skip, limit=limit)
    return [FeatureRead.model_validate(feature.model_dump()) for feature in features]

@router.get("/{feature_id}", response_model=FeatureRead)
async def get_feature(feature_id: PydanticObjectId):
    """Get a specific feature by ID"""
    feature = await FeatureService.get_feature_by_id(feature_id)
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    return FeatureRead.model_validate(feature.model_dump())

@router.put("/{feature_id}", response_model=FeatureRead)
async def update_feature(feature_id: PydanticObjectId, feature_data: FeatureUpdate):
    """Update an existing feature"""
    feature = await FeatureService.update_feature(feature_id, feature_data)
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    return FeatureRead.model_validate(feature.model_dump())

@router.delete("/{feature_id}")
async def delete_feature(feature_id: PydanticObjectId):
    """Delete a feature"""
    success = await FeatureService.delete_feature(feature_id)
    if not success:
        raise HTTPException(status_code=404, detail="Feature not found")
    return {"message": "Feature deleted successfully"}
```

#### **Beanie Document Template**
```python
from beanie import Document, Indexed
from pydantic import Field
from typing import Optional
from datetime import datetime
from enum import Enum

class FeatureStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"

class Feature(Document):
    name: Indexed(str) = Field(..., min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    status: FeatureStatus = Field(default=FeatureStatus.ACTIVE)
    priority: int = Field(default=1, ge=1, le=5)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "features"
        indexes = [
            "name",
            "status", 
            "priority",
            [("status", 1), ("priority", -1)],  # Compound index
            "created_at"
        ]
    
    async def update_timestamp(self):
        """Update the updated_at timestamp"""
        self.updated_at = datetime.utcnow()
        await self.save()
```

### 🎯 **Beanie Performance Benefits**

#### **🚀 MongoDB Advantages**
- Document-based storage natural fit
- Flexible schema evolution
- Horizontal scaling ready
- Rich query language

#### **📚 Beanie ODM Benefits**
- Pydantic integration seamless
- Async operations native
- Aggregation pipelines support
- Type safety with MongoDB

#### **🎨 Vibecoding with Beanie**
- Rapid document prototyping
- Index optimization easy
- Query building intuitive
- Testing straightforward

Ready to vibecode your next MongoDB API! ⚡

---

**🚀 Pronto para vibecoding! Desenvolva APIs rapidamente e impressione sua audiência!**