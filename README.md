# 🚀 Base Inits - Vibecoding Templates & Multi-Agent System

**Production-ready templates** para inicialização rápida de projetos + **Sistema Multi-Agente Autônomo** para desenvolvimento de features seguindo arquiteturas específicas.

## 🎯 O que é este projeto?

### 1. **📁 Templates Vibecoding** 
Templates base otimizados para **desenvolvimento rápido** (15 minutos por feature) com **Claude Code subagents**.

### 2. **🤖 Sistema Multi-Agente Autônomo**
Agentes especializados que **desenvolvem features completas automaticamente** seguindo a arquitetura específica do seu projeto.

## 📁 Templates Disponíveis

### **Backend APIs**
- **🐍 fastapi_sqlalchemy** - FastAPI + SQLAlchemy (sync) + PostgreSQL + JWT
- **⚡ fastapi_sqlalchemy_async** - FastAPI + SQLAlchemy Async + Alta Performance  
- **🍃 fastapi_beanieodm** - FastAPI + Beanie ODM + MongoDB + Async
- **🟢 fastify_api** - Fastify + Prisma + SQLite + JSON Schema
- **🔷 fastify_api_ts** - Fastify + TypeScript + Prisma + Type Safety

### **Frontend Apps**  
- **⚛️ nextjs_vibecoding** - Next.js 14 + shadcn/ui + TanStack Query + Zustand
- **📱 front_flutter** - Flutter + Riverpod + Feature-First + Official MVVM

## 🚀 Quick Start

### **Opção 1: Usar Templates Tradicionais**
```bash
# 1. Clone este repositório
git clone https://github.com/seu-repo/base-inits.git
cd base-inits

# 2. Copie o template desejado
cp -r templates/fastapi_sqlalchemy meu-novo-projeto
cd meu-novo-projeto

# 3. Configure e execute
cp .env.example .env  # Configure suas variáveis
pip install -r requirements.txt
python run.py
```

### **Opção 2: Usar Sistema PRP + Multi-Agente (Recomendado)**
```bash
# 1. Use um template como base
cp -r templates/nextjs_vibecoding meu-app
cd meu-app

# 2. O arquivo CLAUDE.md já está configurado com a arquitetura

# 3. Gere um PRP (Product Requirement Prompt) automaticamente
/create-prp "User authentication with JWT tokens and email verification"

# 4. Execute o PRP com agentes especializados
/execute-prp PRPs/user-authentication/prp.md

# 5. Os agentes desenvolvem a feature completa automaticamente!
# ✅ Database schema + migrations
# ✅ Backend API + authentication  
# ✅ Frontend UI + state management
# ✅ Tests >90% coverage
# ✅ Integration + quality validation
```

## 🤖 Sistema PRP + Multi-Agente Autônomo

### **Como Funciona:**
1. **📋 PRP Generation** - `/create-prp` gera especificações completas baseadas na sua arquitetura
2. **📖 Lê arquitetura** - Agentes leem o `CLAUDE.md` e PRP do seu projeto
3. **🎯 Coordenação automática** - MasterAgent coordena agentes especializados
4. **🔄 Desenvolvimento paralelo** - Múltiplos agentes trabalham simultaneamente
5. **✅ Quality gates** - Validação rigorosa em todas as camadas
6. **🎉 Entrega completa** - Feature production-ready com >90% cobertura

### **🧠 Agentes Disponíveis:**
- **🎯 MasterAgent** - Coordenador geral de features
- **🗄️ DatabaseArchitect** - Especialista em schemas e modelos de dados
- **🛠️ BackendEngineer** - Desenvolvedor de APIs e lógica de negócio
- **🎨 FrontendEngineer** - Especialista em UI/UX e componentes
- **🧪 QAEngineer** - Especialista em qualidade e testes
- **🔗 IntegrationExpert** - Especialista em integração de sistemas

### **📋 Sistema PRP (Product Requirement Prompt):**
- **Geração automática** de especificações técnicas completas
- **Context-aware** - lê e segue a arquitetura do seu projeto
- **Multi-tecnologia** - suporta FastAPI, Next.js, Flutter, Fastify
- **Quality gates** - define validações rigorosas de qualidade
- **Task breakdown** - divide features em tarefas especializadas

### **Exemplo de Uso Avançado:**
```bash
# 1. Gere PRP para feature complexa
/create-prp "E-commerce product catalog with advanced search, filtering, shopping cart, and real-time inventory"

# 2. Execute com coordenação de agentes
/execute-prp PRPs/ecommerce-catalog/prp.md

# O sistema automaticamente:
# ✅ Analisa requisitos e cria especificação técnica completa
# ✅ Coordena DatabaseArchitect para schema otimizado
# ✅ Coordena BackendEngineer para APIs performáticas  
# ✅ Coordena FrontendEngineer para UI responsiva
# ✅ Coordena QAEngineer para testes abrangentes
# ✅ Coordena IntegrationExpert para validação end-to-end
# ✅ Entrega feature production-ready com >90% cobertura
```

### **🚀 Comandos Disponíveis:**
```bash
# Geração de PRP
/create-prp "Feature description here"
/create-prp "User authentication with OAuth" --priority high

# Execução de PRP  
/execute-prp PRPs/feature-name/prp.md
/execute-prp PRPs/user-auth/prp.md --parallel

# Agentes diretos (quando necessário)
/agent master-agent "Coordinate development of dashboard feature"
/agent backend-engineer "Implement Products API"
/agent frontend-engineer "Create responsive product catalog UI"
```

## ✨ Funcionalidades dos Templates

### **📁 Cada Template Inclui:**
- ✅ **Arquitetura vibecoding** - Desenvolvimento rápido (15 min/feature)
- ✅ **Guias detalhados** - Step-by-step para novas features
- ✅ **Prompts Claude Code** - Templates específicos para cada tecnologia  
- ✅ **Exemplos funcionais** - Features demo prontas para usar
- ✅ **Testes abrangentes** - >90% cobertura desde o início
- ✅ **Documentação completa** - CLAUDE.md com toda arquitetura

### **🎯 Guias de Desenvolvimento:**
Cada template possui um **guia completo** no `CLAUDE.md`:
- **Step-by-step** para adicionar features
- **Prompts especialızados** para Claude Code subagents  
- **Decision trees** para escolhas arquiteturais
- **Quality gates** e checklists de completitude
- **Code templates** e exemplos práticos

### **🤖 Integração com Claude Code:**
- **Prompts otimizados** para cada stack tecnológico
- **Subagents especializados** por domínio (Backend, Frontend, QA)
- **Coordenação automática** entre agentes
- **Qualidade garantida** com gates rigorosos

## 🎉 Benefícios

### **⚡ Desenvolvimento Ultrarrápido**
- Features completas em **15-30 minutos**
- Agentes trabalham em **paralelo** automaticamente
- **Zero configuração** - só seguir os padrões

### **🏆 Qualidade Premium**
- **>90% cobertura de testes** obrigatória
- **Validação em múltiplas camadas** (DB, API, UI, Integração)
- **Performance otimizada** (<200ms APIs, <3s UI)
- **Acessibilidade** (WCAG 2.1) incluída

### **🎯 Consistência Arquitetural**
- **Segue padrões específicos** do seu projeto
- **Mantém integridade** arquitetural
- **Escala facilmente** para projetos grandes
- **Reutilizável** em diferentes features

### **📈 Produtividade Maximizada**
- **Claude Code otimizado** com prompts específicos
- **Desenvolvimento autônomo** enquanto você foca na estratégia
- **Documentação automática** de padrões e decisões
- **Onboarding rápido** para novos desenvolvedores