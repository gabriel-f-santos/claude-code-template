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

### **Opção 2: Usar Sistema Multi-Agente (Recomendado)**
```bash
# 1. Use um template como base
cp -r templates/nextjs_vibecoding meu-app
cd meu-app

# 2. O arquivo CLAUDE.md já está configurado com a arquitetura

# 3. Use Claude Code com o sistema multi-agente
/agent master-agent "Develop user authentication feature with JWT tokens"

# 4. Os agentes desenvolvem a feature automaticamente seguindo a arquitetura!
```

## 🤖 Sistema Multi-Agente Autônomo

### **Como Funciona:**
1. **📖 Lê sua arquitetura** - Agentes leem o `CLAUDE.md` do seu projeto
2. **📋 Cria plano detalhado** - MasterAgent cria `MULTI_AGENT_PLAN.md`
3. **🔄 Desenvolvimento coordenado** - Agentes especializados trabalham em paralelo
4. **✅ Validação de qualidade** - Múltiplas camadas de validação e testes
5. **🎯 Entrega completa** - Feature pronta com >90% de cobertura de testes

### **🧠 Agentes Disponíveis:**
- **🎯 MasterAgent** - Coordenador geral de features
- **🗄️ DatabaseArchitect** - Especialista em schemas e modelos de dados
- **🛠️ BackendEngineer** - Desenvolvedor de APIs e lógica de negócio
- **🎨 FrontendEngineer** - Especialista em UI/UX e componentes
- **🧪 QAEngineer** - Especialista em qualidade e testes
- **🔗 IntegrationExpert** - Especialista em integração de sistemas

### **Exemplo de Uso Avançado:**
```bash
# Desenvolvimento de feature completa
/agent master-agent "Develop a complete e-commerce product catalog with:
- Product CRUD operations
- Category management  
- Search and filtering
- Shopping cart integration
- Responsive UI with shadcn/ui
- >90% test coverage
Following the Next.js + FastAPI architecture in CLAUDE.md"

# O sistema automaticamente:
# ✅ Cria schema de banco de dados
# ✅ Implementa API endpoints
# ✅ Desenvolve interface do usuário
# ✅ Cria testes abrangentes
# ✅ Integra frontend com backend
# ✅ Valida qualidade em todas as camadas
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