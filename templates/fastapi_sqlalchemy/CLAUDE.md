# FastAPI SQLAlchemy Modular Template

## Arquitetura Modular por Features

Esta versão implementa uma arquitetura modular organizada por features/domínios, seguindo os princípios de Clean Architecture e Domain-Driven Design.

## Estrutura do Projeto
```
├── alembic/               # Migrações do banco
├── src/
│   ├── core/              # Configurações e serviços centrais
│   │   ├── database.py    # Configuração do banco
│   │   ├── settings.py    # Configurações da aplicação
│   │   └── auth.py       # Serviços de autenticação
│   ├── shared/           # Recursos compartilhados
│   │   ├── models/       # Modelos SQLAlchemy
│   │   │   └── user.py   # Modelo User
│   │   ├── security.py   # Autenticação e autorização
│   │   └── utils.py      # Funções utilitárias
│   ├── accounts/         # Feature de contas/usuários
│   │   ├── api/          # APIs da feature
│   │   │   ├── create_account.py  # Endpoint de criação
│   │   │   ├── login.py          # Endpoint de login
│   │   │   └── account_schemas.py # Schemas Pydantic
│   │   └── repository/   # Repository da feature
│   │       └── account_repository.py # Repository de contas
└── tests/                # Testes automatizados
```

## Comandos Úteis
- `python run.py` - Executar servidor de desenvolvimento
- `pytest tests/test_accounts.py` - Executar testes da feature accounts
- `alembic revision --autogenerate -m "message"` - Criar migração
- `alembic upgrade head` - Aplicar migrações

## Patterns Implementados

### Repository Pattern
Concentra toda a lógica de acesso a dados em classes dedicadas:
```python
class AccountRepository:
    def __init__(self, session: Session):
        self.session = session
    
    def create_user(self, username: str, email: str, password: str) -> User:
        # Lógica de criação concentrada
    
    async def authenticate_user(self, username: str, password: str) -> Optional[User]:
        # Lógica de autenticação concentrada
```

### Feature-based Organization
Cada feature tem sua própria pasta com:
- APIs divididas por responsabilidade específica
- Schemas específicos da feature
- Repository próprio dentro da feature

### Dependency Injection
Cada endpoint recebe suas dependências via FastAPI DI:
```python
async def create_account(user_data: UserCreate, db: Session = Depends(get_db)):
    repo = AccountRepository(db)
    # ...
```

## Prompts Especializados para Claude Code

### Subagent: FastAPI Modular Expert
Use este agente para tarefas relacionadas à arquitetura modular FastAPI.

**Contexto**: Este projeto usa arquitetura modular por features com Repository Pattern. Sempre considere:
- Separação clara entre features/domínios
- Cada feature tem seu próprio repository
- APIs divididas por responsabilidade específica
- Dependency injection para testabilidade
- Schemas centralizados por feature

**Tarefas que este agente pode fazer**:
- Criar novas features seguindo o padrão estabelecido
- Implementar repositories com CRUD completo
- Dividir APIs complexas em endpoints específicos
- Configurar dependency injection
- Criar testes unitários e de integração

**Exemplo de prompt**:
"Como um expert em FastAPI modular, crie uma feature 'posts' completa com repository pattern, incluindo apis separadas para create_post.py, list_posts.py, e schemas apropriados."

### Subagent: Repository Pattern Expert
Use este agente para implementar e otimizar repositories.

**Contexto**: Este projeto usa Repository Pattern para abstrair acesso a dados. Sempre considere:
- Métodos específicos e bem nomeados
- Tratamento de erros adequado
- Queries otimizadas
- Separação entre lógica de negócio e persistência

**Exemplo de prompt**:
"Como um expert em Repository Pattern, implemente um PostRepository com métodos para busca por tags, paginação eficiente e filtros avançados."

### Subagent: Feature Architecture Expert
Use este agente para design de features e organização modular.

**Contexto**: Este projeto organiza código por features/domínios. Sempre considere:
- Baixo acoplamento entre features
- Alta coesão dentro de cada feature
- Interfaces bem definidas
- Reutilização através de shared/

**Exemplo de prompt**:
"Como um expert em arquitetura de features, projete uma feature de 'notifications' que se integre com a feature 'accounts' de forma desacoplada."

## Benefícios da Arquitetura Modular

### ✅ Organização
- Código agrupado por domínio/responsabilidade
- Fácil localização de funcionalidades
- Estrutura escalável

### ✅ Testabilidade
- Repository pattern facilita mocking
- Dependency injection permite testes isolados
- APIs pequenas e focadas

### ✅ Manutenibilidade
- Mudanças isoladas por feature
- Baixo acoplamento entre módulos
- Responsabilidades bem definidas

### ✅ Escalabilidade
- Fácil adição de novas features
- Padrões consistentes
- Reutilização de componentes

## Exemplo de Nova Feature

Para criar uma nova feature, siga esta estrutura:
```
src/
└── nova_feature/
    ├── api/
    │   ├── action1.py
    │   ├── action2.py
    │   └── nova_feature_schemas.py
    └── repository/
        └── nova_feature_repository.py
```

## Configurações de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SECRET_KEY=sua-chave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```