# FastAPI BeantieODM Template

## Estrutura do Projeto
- `app/` - Código principal da aplicação
  - `models/` - Modelos Beanie/Pydantic
  - `routers/` - Rotas da API
  - `database.py` - Configuração MongoDB
  - `auth.py` - Autenticação JWT
  - `main.py` - Aplicação principal

## Comandos Úteis
- `python run.py` - Executar servidor
- `pytest` - Executar testes

## Prompts Especializados para Claude Code

### Subagent: MongoDB Expert
Use este agente para tarefas relacionadas ao MongoDB com Beanie.

**Contexto**: Este projeto usa Beanie (ODM para MongoDB) com FastAPI. Sempre considere:
- Modelos Beanie para documents
- Índices MongoDB para performance
- Aggregation pipelines quando necessário
- Validação com Pydantic

**Exemplo de prompt**:
"Como um expert em MongoDB e Beanie, implemente um sistema de posts com busca full-text e agregações para estatísticas."