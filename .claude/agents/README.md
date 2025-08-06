# 🤖 Multi-Agent Development System - Agent Directory

This directory contains specialized agents designed for autonomous feature development following project-specific architectures.

## 📂 Agent Files

### 🎯 **master-agent.md** - Feature Coordinator
The orchestrator that coordinates all other agents for complete feature development.
- Reads project architecture from CLAUDE.md
- Creates comprehensive development plans  
- Delegates tasks to specialized agents
- Monitors progress and quality gates
- Coordinates integration and delivery

### 🗄️ **database-architect.md** - Data Modeling Specialist
Designs and implements database schemas and models.
- Creates optimized database schemas
- Implements ORM/ODM models (SQLAlchemy, Prisma, Beanie)
- Designs performance indexes and relationships
- Creates migration scripts and rollback plans

### 🛠️ **backend-engineer.md** - API Development Specialist  
Implements robust backend features and APIs.
- Develops REST/GraphQL APIs following project patterns
- Implements business logic and data validation
- Creates comprehensive API tests (>90% coverage)
- Handles authentication, authorization, and security

### 🎨 **frontend-engineer.md** - UI Development Specialist
Implements beautiful, responsive user interfaces.
- Creates React/Flutter components following design systems
- Implements state management (Zustand, Riverpod, etc.)
- Handles API integration and error states
- Ensures accessibility and responsive design

### 🧪 **qa-engineer.md** - Quality Assurance Specialist
Ensures comprehensive quality validation across all layers.
- Creates detailed test plans and scenarios
- Validates backend APIs and frontend components
- Ensures >90% test coverage across all layers
- Verifies performance, security, and accessibility

### 🔗 **integration-expert.md** - System Integration Specialist
Coordinates system integration and end-to-end validation.
- Validates API contracts and data flows
- Tests complete user journeys end-to-end
- Ensures performance across integrated systems
- Sets up monitoring and observability

## 🚀 How to Use These Agents

### 1. **Project Setup**
Ensure your project has a `CLAUDE.md` file documenting your architecture:
- Technology stack and frameworks
- Architecture patterns and conventions
- Code styles and quality standards
- Testing requirements and patterns

### 2. **Launch MasterAgent**
```bash
/agent master-agent "Develop [feature-name] following the architecture in CLAUDE.md"
```

The MasterAgent will:
1. Read your project's `CLAUDE.md` 
2. Create a `MULTI_AGENT_PLAN.md`
3. Delegate tasks to specialized agents
4. Coordinate development and ensure quality

### 3. **Launch Specific Agents** (if needed)
```bash
# For specific tasks
/agent backend-engineer "Implement Products API with full CRUD operations"
/agent frontend-engineer "Create product management UI following design system"
/agent qa-engineer "Create comprehensive test plan for authentication feature"
```

## 📋 Agent Coordination

### **Multi-Agent Plan**
Agents coordinate through `MULTI_AGENT_PLAN.md`:
- Task breakdown and assignments
- Progress tracking and updates
- Quality gates and checkpoints
- Integration coordination

### **Quality Gates**
Each agent must meet strict quality standards:
- **Database**: Schema validated, migrations tested
- **Backend**: >90% test coverage, performance validated  
- **Frontend**: Accessibility compliance, responsive design
- **QA**: Comprehensive test coverage, quality validation
- **Integration**: End-to-end flows working, monitoring ready

### **Progress Tracking**
Agents update progress in the multi-agent plan:
- Task completion status
- Quality metrics achieved
- Issues encountered and resolved
- Next steps and dependencies

## 🎯 Agent Specialization

### **Technology Awareness**
Each agent reads `CLAUDE.md` to understand:
- **FastAPI projects**: SQLAlchemy/Beanie, Pydantic schemas, async patterns
- **React/Next.js projects**: shadcn/ui, TanStack Query, Zustand, TypeScript
- **Flutter projects**: Riverpod, Freezed, feature-first architecture
- **Fastify projects**: Prisma, JSON Schema, vibecoding patterns

### **Pattern Following**
Agents follow project-specific patterns:
- Code organization and file structure
- Naming conventions and style guides
- Testing frameworks and coverage requirements
- Performance and security standards

### **Quality Standards**
All agents enforce consistent quality:
- >90% test coverage requirement
- Performance benchmarks (<200ms API, <3s UI)
- Accessibility compliance (WCAG 2.1)
- Security best practices

## 🔧 Customization

### **Adding New Agents**
To create new specialized agents:
1. Create new `.md` file in this directory
2. Follow the existing agent format:
   - Mission and responsibilities
   - Technology-specific guidelines
   - Quality gates and checklists
   - Progress reporting format

### **Modifying Existing Agents**  
To customize agents for your needs:
1. Edit the relevant agent `.md` file
2. Update technology-specific sections
3. Adjust quality gates and requirements
4. Modify progress reporting format

### **Project-Specific Agents**
For highly specialized domains:
1. Create domain-specific agent files
2. Reference your `CLAUDE.md` patterns
3. Define clear quality gates
4. Integrate with MasterAgent coordination

## 🚨 Important Notes

### **CLAUDE.md Dependency**
- All agents require a well-documented `CLAUDE.md` file
- Agents read architecture patterns from this file
- Keep `CLAUDE.md` updated with project conventions

### **Quality First**
- Never compromise on quality gates
- Ensure >90% test coverage across all layers
- Validate performance and security requirements
- Maintain accessibility standards

### **Coordination is Key**
- Always use MasterAgent for complex features
- Update `MULTI_AGENT_PLAN.md` with progress
- Coordinate dependencies between agents
- Validate integration points thoroughly

## 🎉 Benefits of Multi-Agent Development

### **🚀 Speed**
- Complete features in 15-30 minutes
- Parallel development by specialized agents
- Consistent patterns reduce decision overhead

### **🏆 Quality**
- Multiple validation layers
- Enforced testing standards
- Performance and security built-in

### **🎯 Consistency**
- Follows your project's specific patterns
- Maintains architectural integrity
- Enforces coding standards

### **📈 Scalability**
- Works with any technology stack
- Adapts to different project needs
- Reusable across multiple features

## 🚀 Ready to Code!

Your multi-agent system is configured and ready to develop features autonomously:

1. **Document your architecture** in `CLAUDE.md`
2. **Launch the MasterAgent** with feature requirements
3. **Watch agents coordinate** development automatically
4. **Review high-quality deliverables** at each quality gate

Let's build amazing software with autonomous agents! 🤖✨