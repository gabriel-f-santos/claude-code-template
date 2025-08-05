# Base Inits - Templates de Projeto

Templates base para inicialização rápida de projetos com diferentes tecnologias.

## Templates Disponíveis

### Backend
- **fastapi_sqlalchemy** - FastAPI com SQLAlchemy, PostgreSQL, autenticação JWT
- **fastapi_beanieodm** - FastAPI com BeantieODM, MongoDB

### Frontend  
- **front_nextjs** - Next.js 14 com TypeScript, Tailwind CSS
- **front_flutter** - Flutter com Provider, GoRouter

## Como Usar

1. Clone este repositório
2. Copie o template desejado para seu novo projeto
3. Renomeie as pastas/arquivos conforme necessário
4. Configure as variáveis de ambiente
5. Instale as dependências
6. Comece a desenvolver!

## Exemplo de Uso

```bash
# Clonar este repositório
git clone <url-do-repo> base-inits

# Copiar template para novo projeto
cp -r base-inits/templates/fastapi_sqlalchemy meu-novo-projeto

# Configurar ambiente
cd meu-novo-projeto
cp .env.example .env
# Editar .env com suas configurações

# Instalar dependências
pip install -r requirements.txt

# Executar
python run.py
```

## Funcionalidades Incluídas

Cada template inclui:
- ✅ Estrutura de projeto organizada
- ✅ Configurações de ambiente
- ✅ Exemplos básicos funcionais
- ✅ Arquivo CLAUDE.md com prompts especializados
- ✅ Testes básicos (onde aplicável)
- ✅ Documentação de setup

## Claude Code Integration

Cada template possui um arquivo `CLAUDE.md` com:
- Prompts especializados para Claude Code
- Subagents específicos para a tecnologia
- Exemplos de uso
- Contexto do projeto

Isso permite que você use Claude Code de forma mais eficiente, com prompts otimizados para cada tipo de projeto.