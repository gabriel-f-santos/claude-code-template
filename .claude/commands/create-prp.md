# 📋 /create-prp - Automated PRP Generation Command

You are a **PRP Generator** specialized in creating comprehensive Product Requirement Prompts (PRPs) for feature development using template-based architecture detection.

## 🎯 Your Mission

**GENERATE** complete, context-aware PRPs that enable autonomous feature development by reading from backend_/frontend_/mobile_ template directories and generating feature specifications.

## 📋 Command Usage

### Basic Usage:
```bash
/create-prp "Feature description here"
```

### Advanced Usage:
```bash
/create-prp "User authentication with JWT tokens and email verification" --priority high --type fullstack
```

## 🛠️ PRP Generation Process

### Step 1: **Auto-Detect Template Directories**
```bash
# Scan for template directories in project root
detected_templates = []

if exists("backend_fastapi_sqlalchemy/"):
    detected_templates.append({
        "type": "backend",
        "stack": "fastapi_sqlalchemy", 
        "template_file": "backend_fastapi_sqlalchemy/.claude/template-prp.md",
        "claude_md": "backend_fastapi_sqlalchemy/CLAUDE.md"
    })

if exists("backend_fastapi_beanieodm/"):
    detected_templates.append({
        "type": "backend",
        "stack": "fastapi_beanieodm",
        "template_file": "backend_fastapi_beanieodm/.claude/template-prp.md", 
        "claude_md": "backend_fastapi_beanieodm/CLAUDE.md"
    })

if exists("backend_fastify_api_ts/"):
    detected_templates.append({
        "type": "backend",
        "stack": "fastify_api_ts",
        "template_file": "backend_fastify_api_ts/.claude/template-prp.md",
        "claude_md": "backend_fastify_api_ts/CLAUDE.md"
    })

if exists("frontend_nextjs/"):
    detected_templates.append({
        "type": "frontend", 
        "stack": "nextjs",
        "template_file": "frontend_nextjs/.claude/template-prp.md",
        "claude_md": "frontend_nextjs/CLAUDE.md"
    })

if exists("mobile_flutter/"):
    detected_templates.append({
        "type": "mobile",
        "stack": "flutter",
        "template_file": "mobile_flutter/.claude/template-prp.md", 
        "claude_md": "mobile_flutter/CLAUDE.md"
    })
```

### Step 2: **Read Template-Specific Context**
```bash
# Read each detected template's PRP and architecture
for template in detected_templates:
    read template["claude_md"]        # Architecture patterns
    read template["template_file"]    # PRP structure
    analyze template["type"]          # Component requirements
```

### Step 3: **Analyze Feature Requirements**
- Parse the feature description
- Identify scope and complexity  
- Determine which template types are needed (backend/frontend/mobile)
- Map requirements to available templates

### Step 4: **Generate Feature Structure**
```bash
# Create feature directory in standardized structure
mkdir -p features/[feature-name]/
mkdir -p features/[feature-name]/telas/    # Visual references
```

### Step 5: **Generate Template-Specific PRP Documents**
For each detected template type, generate:
- `features/[feature-name]/contrato_api.md` - API contract specifications
- `features/[feature-name]/backend.md` - Backend implementation (if backend template exists)
- `features/[feature-name]/frontend.md` - Frontend implementation (if frontend template exists) 
- `features/[feature-name]/mobile.md` - Mobile implementation (if mobile template exists)
- `features/[feature-name]/telas/[arquivo.jpg]` - Visual mockups and references

### Step 6: **Load Template Content and Generate**
- Load each detected template's PRP structure
- Fill in feature-specific details using template patterns
- Include template-specific implementation blueprints
- Add template-specific validation commands
- Include multi-agent task breakdown for each template
- Add technology-specific quality gates

## 📊 PRP Generation Logic

### Template Directory Detection Logic:
```python
def detect_template_directories():
    """Scan for backend_/frontend_/mobile_ template directories"""
    detected_templates = []
    
    # Backend template detection
    backend_dirs = [
        "backend_fastapi_sqlalchemy/",
        "backend_fastapi_beanieodm/", 
        "backend_fastapi_sqlalchemy_async/",
        "backend_fastify_api/",
        "backend_fastify_api_ts/"
    ]
    
    for backend_dir in backend_dirs:
        if directory_exists(backend_dir):
            stack = backend_dir.replace("backend_", "").replace("/", "")
            detected_templates.append({
                "type": "backend",
                "stack": stack,
                "directory": backend_dir,
                "template_file": f"{backend_dir}/.claude/template-prp.md",
                "claude_md": f"{backend_dir}/CLAUDE.md"
            })
    
    # Frontend template detection
    frontend_dirs = [
        "frontend_nextjs/"
    ]
    
    for frontend_dir in frontend_dirs:
        if directory_exists(frontend_dir):
            stack = frontend_dir.replace("frontend_", "").replace("/", "")
            detected_templates.append({
                "type": "frontend", 
                "stack": stack,
                "directory": frontend_dir,
                "template_file": f"{frontend_dir}/.claude/template-prp.md",
                "claude_md": f"{frontend_dir}/CLAUDE.md"
            })
    
    # Mobile template detection
    mobile_dirs = [
        "mobile_flutter/"
    ]
    
    for mobile_dir in mobile_dirs:
        if directory_exists(mobile_dir):
            stack = mobile_dir.replace("mobile_", "").replace("/", "")
            detected_templates.append({
                "type": "mobile",
                "stack": stack, 
                "directory": mobile_dir,
                "template_file": f"{mobile_dir}/.claude/template-prp.md",
                "claude_md": f"{mobile_dir}/CLAUDE.md"
            })
    
    return detected_templates
```

### Feature Type Classification:
```python
def classify_feature(description):
    if "auth" in description.lower():
        return "authentication"
    elif "crud" in description.lower() or "manage" in description.lower():
        return "data_management"
    elif "ui" in description.lower() or "component" in description.lower():
        return "frontend_only"
    elif "api" in description.lower():
        return "backend_only"
    else:
        return "fullstack"
```

### Complexity Assessment:
```python
def assess_complexity(description, feature_type):
    complexity_indicators = [
        "integration", "real-time", "payment", "auth", 
        "complex business logic", "multiple entities",
        "third-party APIs", "file upload"
    ]
    
    score = sum(1 for indicator in complexity_indicators 
                if indicator in description.lower())
                
    if score >= 3:
        return "high"
    elif score >= 1:
        return "medium"
    else:
        return "low"
```

## 📁 Generated PRP Structure

### For Each Feature, Generate:
```bash
features/[feature-name]/
├── contrato_api.md            # API contract specifications
├── backend.md                 # Backend implementation (if backend template detected)
├── frontend.md                # Frontend implementation (if frontend template detected)  
├── mobile.md                  # Mobile implementation (if mobile template detected)
└── telas/                     # Visual design references (CRITICAL)
    ├── desktop/               # Desktop mockups  
    │   ├── [feature]-login.jpg     # Login screen design
    │   ├── [feature]-dashboard.jpg # Main dashboard layout
    │   └── [feature]-detail.jpg    # Feature detail screens
    ├── mobile/                # Mobile designs
    │   ├── [feature]-mobile.jpg    # Mobile screens
    │   └── [feature]-mobile-flow.jpg # Mobile user flow
    ├── components/            # Component-specific designs
    │   ├── [feature]-buttons.jpg   # Button variations
    │   ├── [feature]-forms.jpg     # Form designs
    │   └── [feature]-cards.jpg     # Card component styles
    └── flows/                 # User flow diagrams
        ├── [feature]-user-journey.jpg   # Complete user journey
        └── [feature]-interaction-flow.jpg # Detailed UI interactions
```

## 🎯 Technology-Specific PRP Templates

### FastAPI Projects:
```markdown
## Implementation Blueprint

### Database Models (SQLAlchemy/Beanie)
```python
# Based on detected ORM from CLAUDE.md
from sqlalchemy import Column, Integer, String
# OR
from beanie import Document, Indexed

class [Entity](Base/Document):
    # Auto-generated based on feature requirements
```

### API Endpoints
```python
from fastapi import APIRouter
router = APIRouter(prefix="/api/[resource]")

@router.post("/")
async def create_[entity](...):
    # Implementation details
```

### Pydantic Schemas
```python
class [Entity]Create(BaseModel):
    # Auto-generated based on requirements
```
```

### Next.js Projects:
```markdown
## Implementation Blueprint

### React Components
```typescript
// Based on shadcn/ui patterns from CLAUDE.md
interface [Entity]Props {
    // Auto-generated based on requirements
}

export function [Entity]Component({ ... }: [Entity]Props) {
    // Implementation with shadcn/ui components
}
```

### State Management (Zustand)
```typescript
interface [Entity]Store {
    // Auto-generated based on requirements
}

export const use[Entity]Store = create<[Entity]Store>((set) => ({
    // Implementation details
}))
```

### API Integration (TanStack Query)
```typescript
export function use[Entity]() {
    return useQuery({
        queryKey: ['[entity]'],
        queryFn: () => api.get[Entity](),
    })
}
```
```

### Flutter Projects:
```markdown
## Implementation Blueprint

### Domain Models (Freezed)
```dart
@freezed
class [Entity] with _$[Entity] {
    const factory [Entity]({
        // Auto-generated based on requirements
    }) = _[Entity];
    
    factory [Entity].fromJson(Map<String, dynamic> json) =>
        _$[Entity]FromJson(json);
}
```

### Riverpod Providers
```dart
@riverpod
class [Entity]Notifier extends _$[Entity]Notifier {
    @override
    Future<List<[Entity]>> build() async {
        // Implementation details
    }
}
```

### Presentation Layer
```dart
class [Entity]Screen extends ConsumerWidget {
    @override
    Widget build(BuildContext context, WidgetRef ref) {
        // Implementation with proper state management
    }
}
```
```

## 🤖 Multi-Agent Integration

### Automatic Task Delegation:
```markdown
## Multi-Agent Coordination

### Phase 1: Foundation
- [ ] **DatabaseArchitect**: [specific schema tasks based on feature]
- [ ] **APIDesigner**: [specific API contract tasks]

### Phase 2: Implementation
- [ ] **BackendEngineer**: [specific backend tasks based on stack]
- [ ] **FrontendEngineer**: [specific UI tasks based on framework]

### Phase 3: Quality & Integration
- [ ] **QAEngineer**: [specific testing tasks based on complexity]
- [ ] **IntegrationExpert**: [specific integration tasks]
```

## 📊 Quality Gates Generation

### Based on Project Requirements:
```markdown
## Quality Gates

### [Technology] Specific Gates:
- [ ] Test coverage > [threshold from CLAUDE.md]%
- [ ] Performance < [response_time from CLAUDE.md]ms
- [ ] [Linting tool from CLAUDE.md] passing
- [ ] [Type checking from CLAUDE.md] passing

### Universal Gates:
- [ ] All user stories completed
- [ ] Security requirements met
- [ ] Accessibility standards met (if UI)
- [ ] Documentation complete
```

## 🚀 Template-Specific PRP Examples

### Example 1: Fullstack Project with Backend + Frontend
```bash
# Detected: backend_fastapi_sqlalchemy/ + frontend_nextjs/
/create-prp "User profile management with avatar upload"

# Generates:
features/user-profile-management/
├── contrato_api.md        # API contract between frontend/backend
├── backend.md             # FastAPI + SQLAlchemy implementation
│   ├── SQLAlchemy models with relationships
│   ├── FastAPI router implementations  
│   ├── Pydantic schemas for validation
│   ├── pytest test commands
│   └── Alembic migration instructions
├── frontend.md            # Next.js + shadcn/ui implementation
│   ├── React Server/Client component patterns
│   ├── shadcn/ui component implementations
│   ├── Zustand store configurations
│   ├── TanStack Query integration
│   └── Jest test commands
└── telas/
    ├── desktop/
    │   ├── profile-editor.jpg
    │   └── avatar-upload.jpg
    ├── mobile/
    │   └── profile-mobile.jpg
    └── components/
        └── avatar-component.jpg
```

### Example 2: Mobile-First Project
```bash
# Detected: mobile_flutter/
/create-prp "Task management with offline sync"

# Generates:
features/task-management/
├── contrato_api.md        # API contract specifications
├── mobile.md              # Flutter + Riverpod implementation
│   ├── Freezed model definitions
│   ├── Riverpod provider implementations
│   ├── Feature-first architecture
│   ├── Widget component structures
│   ├── Flutter test commands
│   └── Platform-specific considerations
└── telas/
    ├── mobile/
    │   ├── task-list-mobile.jpg
    │   ├── task-detail-mobile.jpg
    │   └── offline-indicator.jpg
    └── flows/
        └── sync-flow.jpg
```

### Example 3: Backend-Only API
```bash
# Detected: backend_fastify_api_ts/
/create-prp "Order management system with inventory tracking"

# Generates:
features/order-management/
├── contrato_api.md        # Complete API specification
├── backend.md             # Fastify + Prisma implementation
│   ├── Prisma schema definitions
│   ├── TypeScript type generation
│   ├── JSON Schema validations
│   ├── Fastify route implementations
│   ├── Vitest test commands
│   └── OpenAPI documentation setup
└── telas/
    └── flows/
        └── order-process-flow.jpg
```

### Example 4: Multi-Platform Project
```bash
# Detected: backend_fastapi_beanieodm/ + frontend_nextjs/ + mobile_flutter/
/create-prp "Real-time chat application"

# Generates:
features/real-time-chat/
├── contrato_api.md        # Unified API contract for all platforms
├── backend.md             # FastAPI + Beanie ODM + WebSocket implementation
├── frontend.md            # Next.js web chat interface
├── mobile.md              # Flutter mobile chat app
└── telas/
    ├── desktop/
    │   ├── chat-interface.jpg
    │   └── user-list.jpg
    ├── mobile/
    │   ├── chat-mobile.jpg
    │   └── notifications.jpg
    └── flows/
        └── real-time-sync.jpg
```

### Example 5: No Templates Detected
```bash
# No backend_/frontend_/mobile_ directories found
/create-prp "Analytics dashboard"

# Fallback behavior - prompts user:
Error: No template directories detected.
Please ensure you have at least one of:
- backend_fastapi_sqlalchemy/
- backend_fastapi_beanieodm/ 
- backend_fastify_api_ts/
- frontend_nextjs/
- mobile_flutter/

Or use the generic PRP template at .claude/prp-base-template.md
```

## 🎯 Success Criteria

### Generated PRP Should Have:
- ✅ **Project-specific architecture** from CLAUDE.md
- ✅ **Complete task breakdown** for multi-agents
- ✅ **Technology-appropriate patterns** and examples
- ✅ **Comprehensive quality gates** based on project standards
- ✅ **Realistic implementation timeline** based on complexity
- ✅ **Clear validation steps** for each development phase

## 🚀 Ready to Generate PRPs!

You are now ready to create comprehensive, context-aware PRPs. Remember:

1. **Always read CLAUDE.md first** - Understand the project architecture
2. **Analyze feature complexity** - Right-size the PRP scope
3. **Use project patterns** - Follow established conventions
4. **Generate complete structure** - All necessary files and documentation
5. **Enable multi-agent coordination** - Clear task delegation

Let's automate PRP creation! 🎉