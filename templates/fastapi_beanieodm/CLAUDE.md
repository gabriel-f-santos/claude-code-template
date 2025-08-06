# FastAPI Beanie ODM Modular Template

## Arquitetura Modular por Features (MongoDB)

Esta versão implementa uma arquitetura modular organizada por features/domínios com Beanie ODM para MongoDB, seguindo os princípios de Clean Architecture e Domain-Driven Design.

## Estrutura do Projeto
```
├── src/
│   ├── core/              # Configurações e serviços centrais
│   │   ├── database.py    # Configuração async do MongoDB
│   │   ├── settings.py    # Configurações da aplicação
│   │   └── auth.py       # Serviços de autenticação
│   ├── shared/           # Recursos compartilhados
│   │   ├── models/       # Modelos Beanie
│   │   │   └── user.py   # Documento User
│   │   ├── security.py   # Autenticação e autorização async
│   │   └── utils.py      # Funções utilitárias para MongoDB
│   ├── accounts/         # Feature de contas/usuários
│   │   ├── api/          # APIs async da feature
│   │   │   ├── create_account.py  # Endpoint async de criação
│   │   │   ├── login.py          # Endpoint async de login
│   │   │   └── account_schemas.py # Schemas Pydantic
│   │   └── repository/   # Repository async da feature
│   │       └── account_repository.py # Repository async MongoDB
└── tests/                # Testes async automatizados
```

## Comandos Úteis
- `python run.py` - Executar servidor de desenvolvimento
- `pytest tests/test_accounts.py` - Executar testes async
- `mongosh` - Acessar MongoDB shell

## Patterns Implementados (MongoDB Async)

### Beanie Document Pattern
Modelos baseados em Beanie Document:
```python
from beanie import Document
from pydantic import EmailStr

class User(Document):
    username: str
    email: EmailStr
    hashed_password: str
    
    class Settings:
        name = "users"
        indexes = ["email", "username"]
```

### Async Repository Pattern
Repository totalmente async com MongoDB:
```python
class AccountRepository:
    async def create_user(self, username: str, email: str, password: str) -> User:
        user = User(username=username, email=email, ...)
        await user.create()
        return user
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        return await User.find_one(User.email == email)
```

### MongoDB Queries
Queries modernas com Beanie:
```python
# Find one
user = await User.find_one(User.email == email)

# Find many with pagination
users = await User.find().skip(skip).limit(limit).to_list()

# Update document
await user.update({"$set": {"field": "value"}})

# Complex queries
users = await User.find({"$or": [{"username": username}, {"email": email}]})
```

## Prompts Especializados para Claude Code

### Subagent: FastAPI MongoDB Expert
Use este agente para tarefas relacionadas ao FastAPI com MongoDB.

**Contexto**: Este projeto usa FastAPI com Beanie ODM para MongoDB. Sempre considere:
- Todas as operações são async/await
- Modelos baseados em Beanie Document
- Queries MongoDB nativas com sintaxe Beanie
- Repository pattern async
- Índices e performance MongoDB

**Tarefas que este agente pode fazer**:
- Criar novos Documents Beanie
- Implementar repositories MongoDB async
- Otimizar queries e agregações
- Configurar índices MongoDB
- Criar operações bulk async

**Exemplo de prompt**:
"Como um expert em FastAPI MongoDB, crie uma feature 'posts' completa com Beanie Document, repository async incluindo agregações para estatísticas, e APIs com paginação otimizada."

### Subagent: Beanie ODM Expert
Use este agente para implementar e otimizar modelos Beanie.

**Contexto**: Este projeto usa Beanie ODM para MongoDB. Sempre considere:
- Documents com validação Pydantic
- Índices MongoDB apropriados
- Relacionamentos entre Documents
- Queries e agregações eficientes

**Exemplo de prompt**:
"Como um expert em Beanie ODM, implemente um sistema de Posts com relacionamentos para Users, incluindo agregações para contadores e índices otimizados."

### Subagent: MongoDB Performance Expert
Use este agente para otimizar performance MongoDB.

**Contexto**: Este projeto prioriza performance MongoDB. Sempre considere:
- Índices compostos eficientes
- Agregation pipelines otimizadas
- Bulk operations para múltiplos documentos
- Connection pooling MongoDB

**Exemplo de prompt**:
"Como um expert em performance MongoDB, otimize queries de busca com filtros complexos, implemente agregações eficientes e configure índices apropriados."

## Benefícios da Arquitetura MongoDB Modular

### ✅ Performance NoSQL
- Operações async não-bloqueantes
- Queries MongoDB nativas
- Agregações poderosas
- Escalabilidade horizontal

### ✅ Flexibilidade
- Schema flexível com validação Pydantic
- Documentos aninhados nativos
- Queries expressivas
- Fácil evolução de schema

### ✅ Organização Modular
- Features autocontidas
- Repository pattern consistente
- Recursos compartilhados centralizados

### ✅ Developer Experience
- Beanie ODM intuitivo
- Async/await nativo
- Validação automática
- Tipos Python nativos

## Diferenças do Template SQLAlchemy

### Database
- **MongoDB** em vez de SQL
- **Beanie Documents** em vez de SQLAlchemy Models
- **Motor** para conexões async
- **Agregações** em vez de JOINs

### Models
- `Document` base class em vez de `Base`
- **Índices MongoDB** declarativos
- **Validação Pydantic** integrada
- **PydanticObjectId** para IDs

### Queries
- `find_one()` e `find()` em vez de `select()`
- **Agregation pipelines** para queries complexas
- **Filtros MongoDB** nativos
- **Operações bulk** otimizadas

### Features Específicas MongoDB
- **Índices compostos** para performance
- **Text search** nativo
- **Geospatial queries** suportadas
- **GridFS** para arquivos grandes

## Configurações de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:
```
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=myapp
SECRET_KEY=sua-chave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Setup MongoDB Local
```bash
# Via Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Via Docker Compose
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
volumes:
  mongodb_data:
```

## Exemplo de Documento Complexo

```python
from beanie import Document
from typing import List, Optional
from datetime import datetime

class Post(Document):
    title: str
    content: str
    author_id: PydanticObjectId
    tags: List[str] = []
    views: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "posts"
        indexes = [
            "author_id",
            "tags",
            [("title", "text"), ("content", "text")],  # Text search
            [("created_at", -1)],  # Descendant sort
        ]
```

Esta arquitetura oferece toda a flexibilidade do MongoDB com a organização e estrutura de uma aplicação enterprise! 🚀