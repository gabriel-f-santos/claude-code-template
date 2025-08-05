# FastAPI SQLAlchemy Async Template

## Estrutura do Projeto
- `app/` - Código principal da aplicação
  - `models/` - Modelos SQLAlchemy
  - `schemas/` - Schemas Pydantic
  - `routers/` - Rotas da API (async)
  - `database.py` - Configuração do banco async
  - `auth.py` - Autenticação JWT
  - `main.py` - Aplicação principal com lifespan
- `tests/` - Testes automatizados async
- `alembic/` - Migrações do banco (async)

## Comandos Úteis
- `python run.py` - Executar servidor de desenvolvimento
- `pytest` - Executar testes async
- `alembic revision --autogenerate -m "message"` - Criar migração
- `alembic upgrade head` - Aplicar migrações

## Diferenças da Versão Sync

### Database Configuration
- Usa `AsyncSession` e `async_sessionmaker` 
- Engine criado com `create_async_engine`
- Dependency injection com `async def get_session()`

### Routes
- Todas as funções são `async def`
- Queries usam `await session.execute(select(...))`
- Métodos de session são async: `await session.commit()`, `await session.refresh()`

### Tests
- Usa `pytest-asyncio` e `@pytest.mark.asyncio`
- AsyncClient para testes HTTP
- Fixtures async para setup/teardown

### Alembic
- Configurado para async com `async_engine_from_config`
- Migrations rodadas via `asyncio.run()`

## Prompts Especializados para Claude Code

### Subagent: FastAPI Async Expert
Use este agente para tarefas relacionadas ao backend FastAPI async com SQLAlchemy.

**Contexto**: Este é um projeto FastAPI com SQLAlchemy async, seguindo padrões modernos de async/await. Sempre considere:
- Uso correto de async/await em todas as operações de banco
- AsyncSession para todas as queries
- Dependency injection async
- Testes async com pytest-asyncio
- Performance e concorrência

**Tarefas que este agente pode fazer**:
- Criar novos modelos SQLAlchemy para async
- Implementar rotas CRUD async
- Configurar autenticação JWT async
- Criar testes automatizados async
- Otimizar queries async e performance
- Configurar migrações Alembic async

**Exemplo de prompt**:
"Como um expert em FastAPI async e SQLAlchemy, implemente um sistema de posts com relacionamento para users, incluindo CRUD completo async, bulk operations, e testes de performance."

### Subagent: Database Async Expert
Use este agente para tarefas específicas de banco de dados async.

**Contexto**: Este projeto usa SQLAlchemy async com Alembic para migrações. Sempre considere:
- Async sessions e transactions
- Connection pooling async
- Bulk operations eficientes
- Lazy loading vs eager loading async

**Exemplo de prompt**:
"Como um expert em SQLAlchemy async, crie um modelo de relacionamento many-to-many entre User e Role com operações bulk async eficientes."

### Subagent: Testing Async Expert
Use este agente para tarefas relacionadas a testes async.

**Contexto**: Este projeto usa pytest-asyncio com fixtures async. Sempre considere:
- Isolamento de testes com banco async
- AsyncClient para testes HTTP
- Fixtures async reutilizáveis
- Testes de concorrência

**Exemplo de prompt**:
"Como um expert em testes Python async, crie uma suíte de testes completa para o módulo de autenticação async, incluindo testes de concorrência e race conditions."

## Configurações de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:
```
DATABASE_URL=sqlite+aiosqlite:///./test.db
# Para PostgreSQL: postgresql+asyncpg://user:password@localhost:5432/dbname
SECRET_KEY=sua-chave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Performance e Async

- ✅ Todas as operações de banco são async
- ✅ Connection pooling otimizado
- ✅ Queries eficientes com select()
- ✅ Testes de concorrência incluídos
- ✅ Lifespan management para recursos async

## Exemplo de Query Async

```python
# Busca simples
result = await session.execute(select(User).where(User.id == user_id))
user = result.scalar_one_or_none()

# Busca com relacionamentos
result = await session.execute(
    select(User).options(selectinload(User.posts)).where(User.id == user_id)
)
user = result.scalar_one_or_none()
```