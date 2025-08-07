# 📋 FastAPI + SQLAlchemy PRP Template

## Meta Information
- **Feature Name**: `{FEATURE_NAME}`
- **Priority**: `{PRIORITY}`
- **Estimated Time**: `{DURATION}`
- **Architecture**: FastAPI + SQLAlchemy + PostgreSQL + JWT

## Purpose
{FEATURE_DESCRIPTION}

## Core Principles
1. **FastAPI Performance**: Async/await patterns, response time <200ms
2. **SQLAlchemy Best Practices**: Proper relationships, migrations, indexes
3. **Security First**: JWT tokens, password hashing, input validation
4. **Test Coverage**: >90% coverage with pytest
5. **API Design**: RESTful endpoints with proper HTTP status codes

---

## Goal
{DETAILED_GOAL}

## Why
{BUSINESS_JUSTIFICATION}

## What
{SPECIFIC_DELIVERABLES}

### Success Criteria
- [ ] All API endpoints working with proper status codes
- [ ] >90% test coverage with pytest
- [ ] Database schema properly designed and migrated
- [ ] Response times <200ms for all endpoints
- [ ] Security validations passing
- [ ] OpenAPI docs auto-generated

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- file: CLAUDE.md
  why: FastAPI + SQLAlchemy architecture patterns and conventions
  
- file: MULTI_AGENT_PLAN.md  
  why: Current development plan and coordination
```

### Visual References
```yaml
# API DESIGN REFERENCES (if applicable)
- directory: PRPs/{FEATURE_NAME}/images/
  contents:
    - api/endpoints-diagram.png     # API structure and relationships
    - api/data-flow.png            # Request/response flow
    - database/schema-diagram.png   # Database schema visual
  why: Visual guidance for API and database design
```

### Current Project Structure
```bash
# FastAPI + SQLAlchemy project structure
backend/
├── app/
│   ├── main.py                 # FastAPI app instance
│   ├── core/
│   │   ├── config.py          # Settings and configuration
│   │   ├── database.py        # Database connection
│   │   └── security.py        # JWT and auth utilities
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py            # Common dependencies
│   │   └── endpoints/         # API route modules
│   ├── models/
│   │   ├── __init__.py
│   │   └── {entity}.py        # SQLAlchemy models
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── {entity}.py        # Pydantic schemas
│   ├── services/
│   │   ├── __init__.py
│   │   └── {entity}_service.py # Business logic
│   └── tests/
│       ├── conftest.py        # Test configuration
│       ├── api/               # API endpoint tests
│       └── services/          # Service layer tests
├── alembic/                   # Database migrations
├── requirements.txt
└── .env.example
```

### Technology Stack Context
```yaml
# FastAPI Stack Specifics
Backend Framework: FastAPI 0.104+
Database ORM: SQLAlchemy 2.0+ (async)
Database: PostgreSQL 15+
Migration Tool: Alembic
Authentication: JWT with Pyjwt
Password Hashing: bcrypt
Testing: pytest + pytest-asyncio
API Docs: OpenAPI 3.0 (auto-generated)
Validation: Pydantic 2.0+
HTTP Client: httpx (for tests)
```

## Implementation Blueprint

### Database Models (SQLAlchemy)
```python
# app/models/{entity}.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class {Entity}(Base):
    __tablename__ = "{entities}"
    
    id = Column(Integer, primary_key=True, index=True)
    # Add specific fields based on feature requirements
    name = Column(String(255), nullable=False, index=True)
    description = Column(String(1000), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Add relationships if needed
    # user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # user = relationship("User", back_populates="{entities}")
```

### Pydantic Schemas
```python
# app/schemas/{entity}.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class {Entity}Base(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True

class {Entity}Create({Entity}Base):
    pass

class {Entity}Update({Entity}Base):
    name: Optional[str] = None
    is_active: Optional[bool] = None

class {Entity}Response({Entity}Base):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

class {Entity}List(BaseModel):
    items: list[{Entity}Response]
    total: int
    page: int
    size: int
```

### API Endpoints (FastAPI)
```python
# app/api/endpoints/{entity}.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_db
from app.schemas.{entity} import {Entity}Create, {Entity}Update, {Entity}Response, {Entity}List
from app.services.{entity}_service import {Entity}Service
from app.api.deps import get_current_user

router = APIRouter(prefix="/{entities}", tags=["{entities}"])

@router.post("/", response_model={Entity}Response, status_code=status.HTTP_201_CREATED)
async def create_{entity}(
    {entity}_data: {Entity}Create,
    db: AsyncSession = Depends(get_async_db),
    current_user = Depends(get_current_user)
):
    """Create a new {entity}"""
    service = {Entity}Service(db)
    return await service.create({entity}_data, user_id=current_user.id)

@router.get("/", response_model={Entity}List)
async def list_{entities}(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(get_async_db),
    current_user = Depends(get_current_user)
):
    """List {entities} with pagination"""
    service = {Entity}Service(db)
    items = await service.get_multi(skip=skip, limit=limit, user_id=current_user.id)
    total = await service.count(user_id=current_user.id)
    return {Entity}List(items=items, total=total, page=skip//limit + 1, size=limit)

@router.get("/{{{entity}_id}}", response_model={Entity}Response)
async def get_{entity}(
    {entity}_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user = Depends(get_current_user)
):
    """Get a specific {entity}"""
    service = {Entity}Service(db)
    {entity} = await service.get({entity}_id, user_id=current_user.id)
    if not {entity}:
        raise HTTPException(status_code=404, detail="{Entity} not found")
    return {entity}

@router.put("/{{{entity}_id}}", response_model={Entity}Response)
async def update_{entity}(
    {entity}_id: int,
    {entity}_data: {Entity}Update,
    db: AsyncSession = Depends(get_async_db),
    current_user = Depends(get_current_user)
):
    """Update a {entity}"""
    service = {Entity}Service(db)
    {entity} = await service.update({entity}_id, {entity}_data, user_id=current_user.id)
    if not {entity}:
        raise HTTPException(status_code=404, detail="{Entity} not found")
    return {entity}

@router.delete("/{{{entity}_id}}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_{entity}(
    {entity}_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user = Depends(get_current_user)
):
    """Delete a {entity}"""
    service = {Entity}Service(db)
    success = await service.delete({entity}_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="{Entity} not found")
```

### Service Layer
```python
# app/services/{entity}_service.py
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.{entity} import {Entity}
from app.schemas.{entity} import {Entity}Create, {Entity}Update

class {Entity}Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, {entity}_data: {Entity}Create, user_id: int) -> {Entity}:
        db_{entity} = {Entity}(**{entity}_data.model_dump(), user_id=user_id)
        self.db.add(db_{entity})
        await self.db.commit()
        await self.db.refresh(db_{entity})
        return db_{entity}

    async def get(self, {entity}_id: int, user_id: int) -> Optional[{Entity}]:
        result = await self.db.execute(
            select({Entity}).where(
                {Entity}.id == {entity}_id,
                {Entity}.user_id == user_id
            )
        )
        return result.scalar_one_or_none()

    async def get_multi(self, skip: int = 0, limit: int = 100, user_id: int) -> List[{Entity}]:
        result = await self.db.execute(
            select({Entity})
            .where({Entity}.user_id == user_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def update(self, {entity}_id: int, {entity}_data: {Entity}Update, user_id: int) -> Optional[{Entity}]:
        db_{entity} = await self.get({entity}_id, user_id)
        if not db_{entity}:
            return None
        
        update_data = {entity}_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_{entity}, field, value)
        
        await self.db.commit()
        await self.db.refresh(db_{entity})
        return db_{entity}

    async def delete(self, {entity}_id: int, user_id: int) -> bool:
        db_{entity} = await self.get({entity}_id, user_id)
        if not db_{entity}:
            return False
        
        await self.db.delete(db_{entity})
        await self.db.commit()
        return True

    async def count(self, user_id: int) -> int:
        result = await self.db.execute(
            select(func.count({Entity}.id)).where({Entity}.user_id == user_id)
        )
        return result.scalar()
```

### Database Migration (Alembic)
```python
# alembic/versions/xxx_create_{entity}_table.py
"""create {entity} table

Revision ID: {revision_id}
Revises: {previous_revision}
Create Date: {timestamp}
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = '{revision_id}'
down_revision = '{previous_revision}'

def upgrade() -> None:
    op.create_table(
        '{entities}',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('name', sa.String(255), nullable=False, index=True),
        sa.Column('description', sa.String(1000), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )

def downgrade() -> None:
    op.drop_table('{entities}')
```

## Task Breakdown

### Phase 1: Database Foundation (DatabaseArchitect)
- [ ] Design {Entity} SQLAlchemy model with proper relationships
- [ ] Create Alembic migration script
- [ ] Add appropriate indexes for query optimization
- [ ] Validate schema against requirements
- [ ] **Quality Gate**: Migration runs successfully, schema validated

### Phase 2: Backend Implementation (BackendEngineer)
- [ ] Implement Pydantic schemas with proper validation
- [ ] Create {Entity}Service with business logic
- [ ] Implement FastAPI router with all CRUD endpoints
- [ ] Add proper error handling and HTTP status codes
- [ ] Integrate JWT authentication and authorization
- [ ] **Quality Gate**: All endpoints working, >90% test coverage, <200ms response

### Phase 3: Testing & Quality (QAEngineer)
- [ ] Write comprehensive pytest test suite
- [ ] Test all API endpoints with different scenarios
- [ ] Test authentication and authorization
- [ ] Test edge cases and error conditions
- [ ] Performance testing for response times
- [ ] **Quality Gate**: All tests passing, coverage >90%

### Phase 4: Integration & Documentation (IntegrationExpert)
- [ ] Test end-to-end API workflows
- [ ] Validate OpenAPI documentation accuracy
- [ ] Test database migrations and rollbacks
- [ ] Performance testing under load
- [ ] **Quality Gate**: Complete integration working, docs accurate

## Validation Commands

### Database Validation
```bash
# Test migration
alembic upgrade head
alembic downgrade -1
alembic upgrade head

# Check database connection
python -c "from app.core.database import engine; print('DB connected')"
```

### Backend Testing
```bash
# Run all tests with coverage
pytest tests/ -v --cov=app --cov-report=html --cov-report=term

# Test specific endpoints
pytest tests/api/test_{entity}.py -v

# Run performance tests
pytest tests/performance/ -v

# Check code quality
ruff check app/
mypy app/
```

### API Validation
```bash
# Start development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Test API endpoints
curl -X GET "http://localhost:8000/{entities}/" -H "Authorization: Bearer {token}"
curl -X POST "http://localhost:8000/{entities}/" -H "Content-Type: application/json" -d '{data}'

# Check API docs
# Navigate to http://localhost:8000/docs
```

### Security Validation
```bash
# Check for security issues
bandit -r app/

# Test JWT token validation
pytest tests/security/test_jwt.py -v
```

## Quality Gates

### Database Quality Gates
- [ ] SQLAlchemy model properly defined with relationships
- [ ] Alembic migration script created and tested
- [ ] Database indexes optimized for expected queries
- [ ] Migration rollback tested successfully
- [ ] Schema follows naming conventions

### Backend Quality Gates  
- [ ] All CRUD endpoints implemented and working
- [ ] Pydantic schemas with proper validation
- [ ] Service layer with business logic separation
- [ ] JWT authentication integrated correctly
- [ ] Error handling with proper HTTP status codes
- [ ] Response times <200ms for all endpoints
- [ ] >90% test coverage with pytest

### API Quality Gates
- [ ] OpenAPI docs auto-generated and accurate
- [ ] RESTful API design principles followed
- [ ] Proper pagination implemented
- [ ] Input validation working correctly
- [ ] CORS configured properly (if needed)
- [ ] API versioning strategy followed

### Security Quality Gates
- [ ] JWT tokens properly validated
- [ ] Password hashing with bcrypt
- [ ] Input sanitization implemented
- [ ] SQL injection protection verified
- [ ] Authorization checks on all protected endpoints
- [ ] Security headers configured

## Anti-Patterns to Avoid
- ❌ Don't use synchronous database operations in async endpoints
- ❌ Don't skip input validation on API endpoints
- ❌ Don't hardcode sensitive data (use environment variables)
- ❌ Don't return database objects directly (use Pydantic schemas)
- ❌ Don't skip database migrations for schema changes
- ❌ Don't ignore proper HTTP status codes
- ❌ Don't skip authentication on protected endpoints

## Final Validation Checklist
- [ ] All API endpoints working correctly
- [ ] Database schema properly designed and migrated
- [ ] >90% test coverage achieved
- [ ] Security requirements satisfied
- [ ] Performance requirements met (<200ms)
- [ ] OpenAPI documentation complete
- [ ] Error handling comprehensive
- [ ] Ready for production deployment

---

## Notes
- Use async/await patterns throughout for best performance
- Follow FastAPI best practices for dependency injection
- Implement proper logging for debugging and monitoring
- Consider rate limiting for production deployment
- Use database connection pooling for scalability