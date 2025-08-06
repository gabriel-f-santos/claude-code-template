# 📋 Base PRP Template

## Meta Information
- **Feature Name**: `[FEATURE_NAME]`
- **Priority**: `[HIGH|MEDIUM|LOW]`
- **Estimated Time**: `[DURATION]`
- **Architecture**: `[READ from CLAUDE.md]`

## Purpose
`[Brief description of what this feature accomplishes]`

## Core Principles
1. **Architecture Compliance**: Follow patterns defined in CLAUDE.md
2. **Quality First**: >90% test coverage mandatory
3. **Type Safety**: Full typing and validation
4. **Performance Optimized**: Meet response time requirements
5. **User Experience**: Intuitive and accessible design

---

## Goal
`[Detailed description of the feature objectives and outcomes]`

## Why
`[Business justification and user value proposition]`

## What
`[Specific deliverables and functionality to be implemented]`

### Success Criteria
- [ ] All functionality working as specified
- [ ] >90% test coverage across all layers
- [ ] Performance requirements met
- [ ] Security requirements satisfied
- [ ] Accessibility compliance verified
- [ ] Documentation complete

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- file: CLAUDE.md
  why: Project architecture, patterns, and conventions
  
- file: MULTI_AGENT_PLAN.md  
  why: Current development plan and coordination
```

### Current Project Structure
```bash
[AUTO-GENERATED: Read current project structure]
```

### Desired Feature Structure
```bash
[AUTO-GENERATED: Based on CLAUDE.md patterns]
```

### Technology Stack Context
```yaml
# From CLAUDE.md
Backend: [FRAMEWORK]
Frontend: [FRAMEWORK] 
Database: [DATABASE]
Testing: [TEST_FRAMEWORK]
Quality: [COVERAGE_REQUIREMENTS]
```

## Implementation Blueprint

### Data Models and Structure
```typescript/python/dart
// [AUTO-GENERATED: Based on feature requirements and stack]
```

### API Contract (if applicable)
```yaml
endpoints:
  - GET /api/[resource]
  - POST /api/[resource]
  - PUT /api/[resource]/{id}
  - DELETE /api/[resource]/{id}
```

### UI Components (if applicable)
```typescript/dart
// [AUTO-GENERATED: Based on design requirements]
```

## Task Breakdown

### Phase 1: Foundation
- [ ] **DatabaseArchitect**: Design schema and models
- [ ] **APIDesigner**: Define API contracts

### Phase 2: Backend Implementation  
- [ ] **BackendEngineer**: Implement API endpoints
- [ ] **BackendEngineer**: Add validation and error handling
- [ ] **BackendEngineer**: Create comprehensive tests

### Phase 3: Frontend Implementation
- [ ] **FrontendEngineer**: Create UI components
- [ ] **FrontendEngineer**: Implement state management
- [ ] **FrontendEngineer**: Add responsive design

### Phase 4: Integration & Quality
- [ ] **QAEngineer**: Create test plan and scenarios
- [ ] **QAEngineer**: Execute comprehensive testing
- [ ] **IntegrationExpert**: Test end-to-end workflows
- [ ] **IntegrationExpert**: Validate API integration

### Phase 5: Deployment & Monitoring
- [ ] **DevOpsEngineer**: Prepare deployment
- [ ] **IntegrationExpert**: Set up monitoring

## Validation Loop

### Level 1: Architecture Compliance
```bash
# Validate against CLAUDE.md patterns
[VALIDATION_COMMANDS]
```

### Level 2: Unit Testing
```bash
# Test coverage requirements
[TEST_COMMANDS]
```

### Level 3: Integration Testing
```bash
# End-to-end validation
[INTEGRATION_COMMANDS]
```

### Level 4: Performance Testing
```bash
# Performance benchmarks
[PERFORMANCE_COMMANDS]
```

## Quality Gates

### Database Quality Gates
- [ ] Schema validated against requirements
- [ ] Migrations tested with rollback capability
- [ ] Indexes optimized for query patterns
- [ ] Data integrity constraints verified

### Backend Quality Gates  
- [ ] >90% test coverage on all endpoints
- [ ] API documentation auto-generated
- [ ] Security validations implemented
- [ ] Performance requirements met

### Frontend Quality Gates
- [ ] Component tests covering user interactions
- [ ] Responsive design on all screen sizes
- [ ] Accessibility compliance (WCAG 2.1)
- [ ] Loading/error states handled properly

### Integration Quality Gates
- [ ] End-to-end user journeys working
- [ ] API contracts validated
- [ ] Error handling across system layers
- [ ] Performance under realistic load

## Anti-Patterns to Avoid
- ❌ Don't skip reading CLAUDE.md architecture
- ❌ Don't implement without proper planning
- ❌ Don't skip writing tests "to save time"
- ❌ Don't break established patterns
- ❌ Don't ignore quality gates
- ❌ Don't deliver without proper validation

## Final Validation Checklist
- [ ] Architecture compliance verified
- [ ] All tests passing (>90% coverage)
- [ ] Performance requirements met
- [ ] Security requirements satisfied
- [ ] Accessibility standards met
- [ ] Documentation complete
- [ ] Multi-agent coordination successful
- [ ] Feature ready for production

---

## Notes
`[Additional context, constraints, or special considerations]`