# 📋 FastAPI + SQLAlchemy Async PRP Template

## Meta Information
- **Feature Name**: `{FEATURE_NAME}`
- **Priority**: `{PRIORITY}`
- **Estimated Time**: `{DURATION}`
- **Architecture**: FastAPI + SQLAlchemy Async + PostgreSQL + JWT

## Purpose
{FEATURE_DESCRIPTION}

## Core Principles
1. **FastAPI Performance**: Full async/await patterns, response time <200ms
2. **SQLAlchemy Async Best Practices**: AsyncSession, async relationships, async queries
3. **Security First**: JWT tokens, password hashing, input validation
4. **Test Coverage**: >90% coverage with pytest-asyncio
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
- [ ] >90% test coverage with pytest-asyncio
- [ ] Database schema properly designed and migrated
- [ ] Response times <200ms for all endpoints (async optimized)
- [ ] Security validations passing
- [ ] OpenAPI docs auto-generated

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- file: CLAUDE.md
  why: FastAPI + SQLAlchemy Async architecture patterns and conventions
  
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
# FastAPI + SQLAlchemy Async project structure
backend/
├── app/
│   ├── main.py                 # FastAPI app instance
│   ├── core/
│   │   ├── config.py          # Settings and configuration
│   │   ├── database.py        # Async database connection
│   │   └── security.py        # JWT and auth utilities
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py            # Common async dependencies
│   │   └── endpoints/         # API route modules
│   ├── models/
│   │   ├── __init__.py
│   │   └── {entity}.py        # SQLAlchemy async models
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── {entity}.py        # Pydantic schemas
│   ├── services/
│   │   ├── __init__.py
│   │   └── {entity}_service.py # Async business logic
│   └── tests/
│       ├── conftest.py        # Async test configuration
│       ├── api/               # API endpoint tests
│       └── services/          # Service layer tests
├── alembic/                   # Database migrations
├── requirements.txt
└── .env.example
```

### Technology Stack Context
```yaml
# FastAPI + SQLAlchemy Async Stack Specifics
Backend Framework: FastAPI 0.104+
Database ORM: SQLAlchemy 2.0+ (fully async)
Database: PostgreSQL 15+ (async driver)
Migration Tool: Alembic (async compatible)
Authentication: JWT with Pyjwt
Password Hashing: bcrypt
Testing: pytest + pytest-asyncio
API Docs: OpenAPI 3.0 (auto-generated)
Validation: Pydantic 2.0+
HTTP Client: httpx (async for tests)
Database Driver: asyncpg
```

## Implementation Blueprint

### Async Database Models (SQLAlchemy)
```python
# app/models/{entity}.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship, selectinload
from sqlalchemy.sql import func
from app.core.database import Base

class {Entity}(Base):
    __tablename__ = "{entities}"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Async relationships (use selectinload for eager loading)
    # user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # user = relationship("User", back_populates="{entities}", lazy="selectin")
    
    def __repr__(self):
        return f"<{Entity}(id={self.id}, name='{self.name}')>"
```

### Pydantic Schemas
```python
# app/schemas/{entity}.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class {Entity}Base(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    is_active: bool = Field(default=True)

class {Entity}Create({Entity}Base):
    pass

class {Entity}Update(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
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

### Async API Endpoints (FastAPI)
```python
# app/api/endpoints/{entity}.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_session
from app.schemas.{entity} import {Entity}Create, {Entity}Update, {Entity}Response, {Entity}List
from app.services.{entity}_service import {Entity}Service
from app.api.deps import get_current_user

router = APIRouter(prefix="/{entities}", tags=["{entities}"])

@router.post("/", response_model={Entity}Response, status_code=status.HTTP_201_CREATED)
async def create_{entity}(
    {entity}_data: {Entity}Create,
    db: AsyncSession = Depends(get_async_session),
    current_user = Depends(get_current_user)
):
    """Create a new {entity}"""
    service = {Entity}Service(db)
    return await service.create({entity}_data, user_id=current_user.id)

@router.get("/", response_model={Entity}List)
async def list_{entities}(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(get_async_session),
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
    db: AsyncSession = Depends(get_async_session),
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
    db: AsyncSession = Depends(get_async_session),
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
    db: AsyncSession = Depends(get_async_session),
    current_user = Depends(get_current_user)
):
    """Delete a {entity}"""
    service = {Entity}Service(db)
    success = await service.delete({entity}_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="{Entity} not found")
```

### Async Service Layer
```python
# app/services/{entity}_service.py
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
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
            select({Entity})
            .options(selectinload({Entity}.user))  # Async eager loading
            .where(
                {Entity}.id == {entity}_id,
                {Entity}.user_id == user_id
            )
        )
        return result.scalar_one_or_none()

    async def get_multi(
        self, 
        skip: int = 0, 
        limit: int = 100, 
        user_id: int = None
    ) -> List[{Entity}]:
        result = await self.db.execute(
            select({Entity})
            .options(selectinload({Entity}.user))  # Async eager loading
            .where({Entity}.user_id == user_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def update(
        self, 
        {entity}_id: int, 
        {entity}_data: {Entity}Update, 
        user_id: int
    ) -> Optional[{Entity}]:
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

### Async Database Migration (Alembic)
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
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    
    # Add indexes for performance
    op.create_index('idx_{entities}_user_active', '{entities}', ['user_id', 'is_active'])
    op.create_index('idx_{entities}_created_at', '{entities}', ['created_at'])

def downgrade() -> None:
    op.drop_index('idx_{entities}_created_at')
    op.drop_index('idx_{entities}_user_active')
    op.drop_table('{entities}')
```

## Task Breakdown

### Phase 1: Async Database Foundation (DatabaseArchitect)
- [ ] Design {Entity} SQLAlchemy async model with proper relationships
- [ ] Create Alembic migration script with async compatibility
- [ ] Add appropriate indexes for async query optimization
- [ ] Configure async database connection with connection pooling
- [ ] **Quality Gate**: Async migration runs successfully, schema validated

### Phase 2: Async Backend Implementation (BackendEngineer)
- [ ] Implement Pydantic schemas with proper validation
- [ ] Create async {Entity}Service with business logic
- [ ] Implement FastAPI router with all async CRUD endpoints
- [ ] Add proper async error handling and HTTP status codes
- [ ] Integrate JWT authentication with async dependencies
- [ ] **Quality Gate**: All endpoints working async, >90% test coverage, <200ms response

### Phase 3: Async Testing & Quality (QAEngineer)
- [ ] Write comprehensive pytest-asyncio test suite
- [ ] Test all async API endpoints with different scenarios
- [ ] Test async authentication and authorization
- [ ] Test edge cases and async error conditions
- [ ] Performance testing for async response times
- [ ] **Quality Gate**: All async tests passing, coverage >90%

### Phase 4: Async Integration & Documentation (IntegrationExpert)
- [ ] Test end-to-end async API workflows
- [ ] Validate OpenAPI documentation accuracy
- [ ] Test async database migrations and rollbacks
- [ ] Performance testing under load with async concurrency
- [ ] **Quality Gate**: Complete async integration working, docs accurate

## Validation Commands

### Async Database Validation
```bash
# Test async migration
alembic upgrade head
alembic downgrade -1
alembic upgrade head

# Check async database connection
python -c "import asyncio; from app.core.database import get_async_session; asyncio.run(next(get_async_session()).__anext__())"
```

### Async Backend Testing
```bash
# Run all async tests with coverage
pytest tests/ -v --cov=app --cov-report=html --cov-report=term --asyncio-mode=auto

# Test specific async endpoints
pytest tests/api/test_{entity}.py -v --asyncio-mode=auto

# Run async performance tests
pytest tests/performance/ -v --asyncio-mode=auto

# Check code quality
ruff check app/
mypy app/
```

### Async API Validation
```bash
# Start development server with async workers
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --loop uvloop

# Test async API endpoints
curl -X GET "http://localhost:8000/{entities}/" -H "Authorization: Bearer {token}"
curl -X POST "http://localhost:8000/{entities}/" -H "Content-Type: application/json" -d '{data}'

# Check API docs
# Navigate to http://localhost:8000/docs
```

### Async Security Validation
```bash
# Check for security issues
bandit -r app/

# Test async JWT token validation
pytest tests/security/test_jwt.py -v --asyncio-mode=auto
```

## Quality Gates

### Async Database Quality Gates
- [ ] SQLAlchemy async model properly defined with relationships
- [ ] Alembic migration script created and tested (async compatible)
- [ ] Database indexes optimized for async expected queries
- [ ] Async migration rollback tested successfully
- [ ] Schema follows async SQLAlchemy naming conventions

### Async Backend Quality Gates  
- [ ] All CRUD endpoints implemented with full async/await
- [ ] Pydantic schemas with proper validation
- [ ] Async service layer with business logic separation
- [ ] JWT authentication integrated correctly with async dependencies
- [ ] Async error handling with proper HTTP status codes
- [ ] Response times <200ms for all async endpoints
- [ ] >90% test coverage with pytest-asyncio

### Async API Quality Gates
- [ ] OpenAPI docs auto-generated and accurate for async endpoints
- [ ] RESTful API design principles followed
- [ ] Proper async pagination implemented
- [ ] Input validation working correctly with async processing
- [ ] CORS configured properly (if needed)
- [ ] API versioning strategy followed

### Async Security Quality Gates
- [ ] JWT tokens properly validated with async dependencies
- [ ] Password hashing with bcrypt (async compatible)
- [ ] Input sanitization implemented
- [ ] SQL injection protection verified with async queries
- [ ] Authorization checks on all protected async endpoints
- [ ] Security headers configured

## Anti-Patterns to Avoid
- ❌ Don't mix synchronous and asynchronous database operations
- ❌ Don't use sync dependencies in async endpoints
- ❌ Don't skip await keywords on database operations
- ❌ Don't use blocking I/O operations in async endpoints
- ❌ Don't ignore async context managers for database sessions
- ❌ Don't forget to use selectinload for async relationships
- ❌ Don't skip async test configurations in pytest

## Final Validation Checklist
- [ ] All API endpoints fully async and working correctly
- [ ] Database schema properly designed with async migrations
- [ ] >90% test coverage achieved with pytest-asyncio
- [ ] Security requirements satisfied with async dependencies
- [ ] Performance requirements met with async optimizations (<200ms)
- [ ] OpenAPI documentation complete for async endpoints
- [ ] Async error handling comprehensive
- [ ] Ready for production deployment with async workers

---

## Notes
- Use full async/await patterns throughout for maximum performance
- Follow FastAPI async best practices for dependency injection
- Use AsyncSession consistently for all database operations
- Configure appropriate connection pooling for async operations
- Implement proper async logging for debugging and monitoring
- Consider async rate limiting for production deployment
- Use async-compatible database drivers (asyncpg for PostgreSQL)
- Leverage SQLAlchemy 2.0+ async features for optimal performance