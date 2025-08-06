# Base Inits - Arquitetura de Templates

Este repositório contém templates base organizados com arquitetura modular por features, seguindo princípios de Clean Architecture e Domain-Driven Design.

## 🏗️ Arquitetura Modular por Features

### Princípios Fundamentais

1. **Feature-First Organization**: Código organizado por domínio de negócio
2. **Repository Pattern**: Abstração de acesso a dados concentrada
3. **Dependency Injection**: Testabilidade e baixo acoplamento
4. **Separation of Concerns**: Responsabilidades bem definidas
5. **API Segregation**: Endpoints divididos por responsabilidade específica

### Estrutura Padrão dos Templates

```
├── alembic/                    # Migrações do banco de dados
│   ├── env.py                 # Configuração do Alembic
│   └── versions/              # Scripts de migração
├── src/                       # Código fonte da aplicação
│   ├── core/                  # Configurações e serviços centrais
│   │   ├── database.py        # Configuração do banco
│   │   ├── settings.py        # Settings com pydantic-settings
│   │   └── auth.py           # Autenticação JWT
│   ├── models/               # Modelos SQLAlchemy compartilhados
│   │   └── user.py          # Modelo User
│   ├── {feature_name}/       # Feature de domínio
│   │   ├── api/              # Endpoints da feature
│   │   │   ├── {action}.py   # Endpoint específico
│   │   │   └── {feature}_schemas.py # Schemas Pydantic
│   │   └── repository/       # Persistência da feature
│   │       └── {feature}_repository.py
└── tests/                    # Testes automatizados
    └── test_{feature}.py
```

## 🎯 Features Implementadas

### Core Services
- **Database**: Configuração SQLAlchemy (sync/async)
- **Settings**: Configurações com pydantic-settings
- **Auth**: Autenticação JWT com PyJWT

### Accounts Feature
- **APIs**:
  - `create_account.py` - Criação de contas
  - `login.py` - Autenticação
  - `account_schemas.py` - Schemas Pydantic
- **Repository**: `account_repository.py` - CRUD completo

## 📁 Templates Disponíveis

### Backend Templates

#### fastapi_sqlalchemy
- **Tecnologia**: FastAPI + SQLAlchemy (sync)
- **Banco**: PostgreSQL/SQLite
- **Autenticação**: JWT com PyJWT
- **Testes**: pytest
- **Estrutura**: Arquitetura modular por features

#### fastapi_sqlalchemy_async
- **Tecnologia**: FastAPI + SQLAlchemy async
- **Banco**: PostgreSQL (asyncpg) / SQLite (aiosqlite)
- **Performance**: High-performance async operations
- **Concorrência**: AsyncSession e connection pooling
- **Estrutura**: Mesma arquitetura modular, versão async

#### fastapi_beanieodm
- **Tecnologia**: FastAPI + Beanie ODM
- **Banco**: MongoDB
- **Estrutura**: Arquitetura básica (em desenvolvimento)

### Frontend Templates

#### front_nextjs
- **Framework**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Estrutura**: App Router

#### front_flutter
- **Framework**: Flutter
- **State**: Provider
- **Navigation**: GoRouter

## 🔧 Patterns Arquiteturais

### Repository Pattern

Concentra toda lógica de acesso a dados:

```python
class FeatureRepository:
    def __init__(self, session: Session):
        self.session = session
    
    def create_entity(self, data: dict) -> Entity:
        # Lógica de criação
    
    def get_by_id(self, entity_id: int) -> Optional[Entity]:
        # Lógica de busca
    
    def update_entity(self, entity_id: int, **kwargs) -> Optional[Entity]:
        # Lógica de atualização
```

### Feature Organization

Cada feature é autocontida:

```
src/
├── models/
│   └── post.py           # Modelo compartilhado
└── posts/
    ├── api/
    │   ├── create_post.py
    │   ├── list_posts.py
    │   └── post_schemas.py
    └── repository/
        └── post_repository.py
```

### Dependency Injection

```python
@router.post("/")
async def create_resource(
    data: CreateSchema, 
    session: AsyncSession = Depends(get_session)
):
    repo = ResourceRepository(session)
    return await repo.create(data)
```

## 🚀 Como Usar os Templates

### 1. Escolha o Template
```bash
# Para API sync
cp -r templates/fastapi_sqlalchemy meu-projeto

# Para API async
cp -r templates/fastapi_sqlalchemy_async meu-projeto-async
```

### 2. Configure o Ambiente
```bash
cd meu-projeto
cp .env.example .env
# Edite .env com suas configurações
```

### 3. Instale Dependências
```bash
pip install -r requirements.txt
```

### 4. Execute
```bash
python run.py
```

## ➕ Adicionando Nova Feature

### 1. Crie a Estrutura
```bash
mkdir -p src/nova_feature/{api,repository}
```

### 2. Crie o Modelo (se necessário)
```python
# src/models/nova_item.py
from sqlalchemy import Column, Integer, String
from src.core.database import Base

class NovaItem(Base):
    __tablename__ = "nova_items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
```

### 3. Implemente Repository
```python
# src/nova_feature/repository/nova_feature_repository.py
from src.models.nova_item import NovaItem

class NovaFeatureRepository:
    def __init__(self, session):
        self.session = session
    
    def create_item(self, data): 
        # Implementar lógica
```

### 4. Crie APIs
```python
# src/nova_feature/api/create_item.py
from fastapi import APIRouter
from ..repository.nova_feature_repository import NovaFeatureRepository

router = APIRouter(prefix="/nova-feature", tags=["nova-feature"])

@router.post("/")
def create_item(data: Schema, db = Depends(get_db)):
    repo = NovaFeatureRepository(db)
    return repo.create_item(data)
```

### 5. Registre no Main
```python
# main.py
from src.nova_feature.api.create_item import router as nova_feature_router
app.include_router(nova_feature_router)
```

## 🧪 Testes

### Estrutura de Testes
- **Isolamento**: Cada feature tem seus próprios testes
- **Mocking**: Repository pattern facilita mocking
- **Fixtures**: Reutilização de configurações
- **Coverage**: Testes unitários e de integração

### Exemplo de Teste
```python
def test_create_account():
    response = client.post("/accounts/", json=test_data)
    assert response.status_code == 201
    assert "id" in response.json()
```

## 📚 Prompts Especializados Claude Code

### Subagent: Feature Architecture Expert
Para design de novas features e organização modular.

**Prompt Exemplo**:
"Como um expert em arquitetura de features, crie uma feature 'products' completa seguindo o padrão estabelecido, incluindo repository com CRUD, APIs separadas por ação e schemas apropriados."

### Subagent: Repository Pattern Expert
Para implementar e otimizar repositories.

**Prompt Exemplo**:
"Como um expert em Repository Pattern, implemente um ProductRepository com métodos para busca avançada, filtros, paginação e relacionamentos otimizados."

### Subagent: FastAPI Modular Expert
Para tarefas relacionadas à arquitetura modular FastAPI.

**Prompt Exemplo**:
"Como um expert em FastAPI modular, refatore este código monolítico em features organizadas com repository pattern e APIs segregadas."

## 🎯 Benefícios da Arquitetura

### ✅ Organização
- Código agrupado por domínio de negócio
- Fácil localização de funcionalidades
- Estrutura escalável e consistente

### ✅ Testabilidade  
- Repository pattern facilita mocking
- Dependency injection permite testes isolados
- APIs pequenas e focadas

### ✅ Manutenibilidade
- Mudanças isoladas por feature
- Baixo acoplamento entre módulos
- Responsabilidades bem definidas

### ✅ Performance (Templates Async)
- Operações não-bloqueantes
- Connection pooling otimizado
- Suporte a alta concorrência

### ✅ Escalabilidade
- Fácil adição de novas features
- Padrões consistentes entre features
- Possibilidade de evolução para microserviços

## 🔧 Tecnologias Utilizadas

### Backend Core
- **FastAPI**: Framework web moderno e rápido
- **SQLAlchemy**: ORM robusto (sync/async)
- **Pydantic Settings**: Configurações tipadas
- **PyJWT**: Autenticação JWT
- **Alembic**: Migrações de banco
- **Pytest**: Framework de testes

### Frontend
- **Next.js**: React framework
- **Flutter**: Mobile framework
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Styling utility-first

## 🎓 Próximos Passos

1. **Middlewares**: Implementar middlewares personalizados
2. **Background Tasks**: Adicionar processamento assíncrono
3. **Caching**: Implementar estratégias de cache
4. **Monitoring**: Observabilidade e logs estruturados
5. **CI/CD**: Pipelines de deploy automatizado

---

Esta arquitetura foi projetada para escalar desde projetos pequenos até aplicações enterprise, mantendo sempre a organização e qualidade do código. 🚀