# FastAPI SQLAlchemy Template

## Estrutura do Projeto
- `app/` - Código principal da aplicação
  - `models/` - Modelos SQLAlchemy
  - `schemas/` - Schemas Pydantic
  - `routers/` - Rotas da API
  - `database.py` - Configuração do banco
  - `auth.py` - Autenticação JWT
  - `main.py` - Aplicação principal
- `tests/` - Testes automatizados
- `alembic/` - Migrações do banco

## Comandos Úteis
- `python run.py` - Executar servidor de desenvolvimento
- `pytest` - Executar testes
- `alembic revision --autogenerate -m "message"` - Criar migração
- `alembic upgrade head` - Aplicar migrações

## Prompts Especializados para Claude Code

### Subagent: FastAPI Backend Expert
Use este agente para tarefas relacionadas ao backend FastAPI com SQLAlchemy.

**Contexto**: Este é um projeto FastAPI com SQLAlchemy, seguindo padrões de arquitetura limpa. Sempre considere:
- Uso de Pydantic schemas para validação
- Dependency injection para database sessions
- Padrão repository/service quando apropriado
- Tratamento adequado de erros HTTP
- Testes automatizados com pytest

**Tarefas que este agente pode fazer**:
- Criar novos modelos SQLAlchemy
- Implementar rotas CRUD
- Configurar autenticação JWT
- Criar testes automatizados
- Configurar migrações Alembic
- Otimizar queries e performance

**Exemplo de prompt**:
"Como um expert em FastAPI e SQLAlchemy, implemente um sistema de posts com relacionamento para users, incluindo CRUD completo, schemas Pydantic, e testes automatizados."

### Subagent: Database Expert
Use este agente para tarefas específicas de banco de dados.

**Contexto**: Este projeto usa SQLAlchemy com Alembic para migrações. Sempre considere:
- Relacionamentos adequados entre tabelas
- Índices para performance
- Constraints de integridade
- Migrações seguras

**Exemplo de prompt**:
"Como um expert em SQLAlchemy, crie um modelo de relacionamento many-to-many entre User e Role, com tabela de associação personalizada incluindo campos extras."

### Subagent: Testing Expert
Use este agente para tarefas relacionadas a testes.

**Contexto**: Este projeto usa pytest com fixtures para testes. Sempre considere:
- Isolamento de testes com banco em memória
- Fixtures reutilizáveis
- Testes de integração para APIs
- Mock de dependências externas

**Exemplo de prompt**:
"Como um expert em testes Python, crie uma suíte de testes completa para o módulo de autenticação, incluindo casos de sucesso e falha."

## Configurações de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SECRET_KEY=sua-chave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Estrutura de Dados Exemplo

O template inclui um modelo User básico com:
- Autenticação JWT
- CRUD completo
- Validação com Pydantic
- Testes automatizados