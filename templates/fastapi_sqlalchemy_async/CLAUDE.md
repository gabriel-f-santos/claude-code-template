# FastAPI SQLAlchemy Async Modular Template

## Arquitetura Modular por Features (Async)

Esta versão implementa uma arquitetura modular organizada por features/domínios com SQLAlchemy async, seguindo os princípios de Clean Architecture e Domain-Driven Design.

## Estrutura do Projeto
```
src/
├── core/                    # Configurações e serviços centrais
│   ├── database.py         # Configuração async do banco
│   ├── settings.py         # Configurações da aplicação
│   └── auth.py            # Serviços de autenticação
├── repositories/          # Repository pattern para persistência
│   └── account_repository.py  # Repository async de contas
├── accounts/              # Feature de contas/usuários
│   └── api/               # APIs da feature
│       ├── create_account.py  # Endpoint async de criação
│       ├── login.py          # Endpoint async de login
│       └── account_schemas.py # Schemas Pydantic
└── shared/                # Recursos compartilhados
    └── models/            # Modelos SQLAlchemy
        └── user.py        # Modelo User
```

## Comandos Úteis
- `python run.py` - Executar servidor de desenvolvimento
- `pytest tests/test_accounts.py` - Executar testes async
- `alembic revision --autogenerate -m "message"` - Criar migração
- `alembic upgrade head` - Aplicar migrações

## Patterns Implementados (Async)

### Async Repository Pattern
Toda a lógica de acesso a dados é async:
```python
class AccountRepository:
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create_user(self, username: str, email: str, password: str) -> User:
        # Lógica async de criação
    
    async def authenticate_user(self, username: str, password: str) -> Optional[User]:
        # Lógica async de autenticação
```

### Async Feature APIs
Todos os endpoints são async com await:
```python
async def create_account(user_data: UserCreate, session: AsyncSession = Depends(get_session)):
    repo = AccountRepository(session)
    user = await repo.create_user(...)
```

### Async Database Operations
Queries modernas com select() e await:
```python
async def get_user_by_id(self, user_id: int) -> Optional[User]:
    result = await self.session.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()
```

## Prompts Especializados para Claude Code

### Subagent: FastAPI Async Modular Expert
Use este agente para tarefas relacionadas à arquitetura modular async FastAPI.

**Contexto**: Este projeto usa arquitetura modular async por features com Repository Pattern. Sempre considere:
- Todas as operações de banco são async/await
- AsyncSession para database operations
- Repositories centralizados em pasta dedicada
- APIs divididas por responsabilidade específica
- Performance e concorrência

**Tarefas que este agente pode fazer**:
- Criar novas features async seguindo o padrão estabelecido
- Implementar repositories async com CRUD completo
- Otimizar queries async para performance
- Configurar operações bulk async
- Criar testes async com pytest-asyncio

**Exemplo de prompt**:
"Como um expert em FastAPI async modular, crie uma feature 'posts' completa com repository pattern async, incluindo apis separadas para create_post.py, list_posts.py com paginação eficiente, e operações bulk."

### Subagent: Async Repository Expert
Use este agente para implementar e otimizar repositories async.

**Contexto**: Este projeto usa Async Repository Pattern para acesso a dados. Sempre considere:
- AsyncSession e await em todas as operações
- Queries otimizadas com select()
- Tratamento adequado de transações async
- Performance e connection pooling

**Exemplo de prompt**:
"Como um expert em Async Repository Pattern, implemente um PostRepository com métodos async para busca por tags, paginação eficiente, operações bulk e relacionamentos eager loading."

### Subagent: Async Performance Expert
Use este agente para otimizar performance em aplicações async.

**Contexto**: Este projeto prioriza performance async. Sempre considere:
- Connection pooling otimizado
- Bulk operations para múltiplos registros
- Eager vs lazy loading
- Concorrência e paralelismo

**Exemplo de prompt**:
"Como um expert em performance async, otimize um repository para processar milhares de registros com operações bulk eficientes e connection pooling adequado."

## Benefícios da Arquitetura Async Modular

### ✅ Performance
- Operações não-bloqueantes
- Melhor utilização de recursos
- Suporte a alta concorrência

### ✅ Escalabilidade
- Connection pooling otimizado
- Operações async eficientes
- Melhor throughput

### ✅ Organização Modular
- Código agrupado por domínio
- Repository pattern consistente
- APIs focadas e testáveis

### ✅ Modernidade
- SQLAlchemy 2.0 async
- Patterns atuais do Python
- Preparado para microserviços

## Diferenças da Versão Sync

### Database
- `AsyncSession` em vez de `Session`
- `await session.execute()` para queries
- `async with` para transações

### Repository
- Todos os métodos são `async def`
- `await` em todas as operações de banco
- `select()` syntax moderna

### APIs
- Endpoints são `async def`
- `AsyncSession = Depends(get_session)`
- `await repo.method()` calls

### Tests
- `@pytest.mark.asyncio`
- `AsyncClient` para testes HTTP
- Fixtures async

## Configurações de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:
```
DATABASE_URL=sqlite+aiosqlite:///./test.db
# Para PostgreSQL: postgresql+asyncpg://user:password@localhost:5432/dbname
SECRET_KEY=sua-chave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```