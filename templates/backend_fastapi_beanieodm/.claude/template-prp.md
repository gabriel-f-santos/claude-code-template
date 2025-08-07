# 📋 FastAPI + Beanie ODM PRP Template

## Meta Information
- **Feature Name**: `{FEATURE_NAME}`
- **Priority**: `{PRIORITY}`
- **Estimated Time**: `{DURATION}`
- **Architecture**: FastAPI + Beanie ODM + MongoDB + JWT

## Purpose
{FEATURE_DESCRIPTION}

## Core Principles
1. **FastAPI Performance**: Async/await patterns, response time <200ms
2. **MongoDB Best Practices**: Document modeling, indexes, aggregations
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
- [ ] MongoDB documents properly designed with indexes
- [ ] Response times <200ms for all endpoints
- [ ] Security validations passing
- [ ] OpenAPI docs auto-generated

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- file: CLAUDE.md
  why: FastAPI + Beanie ODM architecture patterns and conventions
  
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
    - database/collection-schema.png   # MongoDB collection design
  why: Visual guidance for API and database design
```

### Current Project Structure
```bash
# FastAPI + Beanie ODM project structure
backend/
├── app/
│   ├── main.py                 # FastAPI app instance
│   ├── core/
│   │   ├── config.py          # Settings and configuration
│   │   ├── database.py        # MongoDB connection
│   │   └── security.py        # JWT and auth utilities
│   ├── api/
│   │   ├── __init__.py
│   │   └── {entity}.py        # API route modules
│   ├── models/
│   │   ├── __init__.py
│   │   └── {entity}.py        # Beanie documents
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
├── requirements.txt
└── .env.example
```

### Technology Stack Context
```yaml
# FastAPI + MongoDB Stack Specifics
Backend Framework: FastAPI 0.104+
Database ODM: Beanie (Pydantic + Motor)
Database: MongoDB 6.0+
Authentication: JWT with Pyjwt
Password Hashing: bcrypt
Testing: pytest + pytest-asyncio
API Docs: OpenAPI 3.0 (auto-generated)
Validation: Pydantic 2.0+
HTTP Client: httpx (for tests)
```

## Implementation Blueprint

### Beanie Document Models
```python
# app/models/{entity}.py
from datetime import datetime
from typing import Optional, List
from beanie import Document, Indexed
from pydantic import Field
from pymongo import IndexModel, ASCENDING, TEXT

class {Entity}(Document):
    name: Indexed(str, unique=True) = Field(..., min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Add relationships/references if needed
    # user_id: Optional[str] = None
    # tags: List[str] = Field(default_factory=list)
    
    class Settings:
        collection = "{entities}"
        indexes = [
            IndexModel([("name", TEXT)]),
            IndexModel([("created_at", ASCENDING)]),
            IndexModel([("is_active", ASCENDING), ("user_id", ASCENDING)])
        ]
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Example {Entity}",
                "description": "This is an example {entity}",
                "is_active": True
            }
        }
```

### Pydantic Schemas
```python
# app/schemas/{entity}.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class {Entity}Base(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)
    is_active: bool = Field(default=True)

class {Entity}Create({Entity}Base):
    pass

class {Entity}Update(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)
    is_active: Optional[bool] = None

class {Entity}Response({Entity}Base):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "id": "60f7b3b3b3f3f3f3f3f3f3f3",
                "name": "Example {Entity}",
                "description": "This is an example {entity}",
                "is_active": True,
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
        }

class {Entity}List(BaseModel):
    items: list[{Entity}Response]
    total: int
    page: int
    size: int
```

### API Endpoints (FastAPI)
```python
# app/api/{entity}.py
from typing import List
from fastapi import APIRouter, HTTPException, status, Query, Depends
from app.models.{entity} import {Entity}
from app.schemas.{entity} import {Entity}Create, {Entity}Update, {Entity}Response, {Entity}List
from app.services.{entity}_service import {Entity}Service
from app.api.deps import get_current_user

router = APIRouter(prefix="/{entities}", tags=["{entities}"])

@router.post("/", response_model={Entity}Response, status_code=status.HTTP_201_CREATED)
async def create_{entity}(
    {entity}_data: {Entity}Create,
    current_user = Depends(get_current_user)
):
    """Create a new {entity}"""
    service = {Entity}Service()
    return await service.create({entity}_data, user_id=str(current_user.id))

@router.get("/", response_model={Entity}List)
async def list_{entities}(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = Query(None),
    current_user = Depends(get_current_user)
):
    """List {entities} with pagination and search"""
    service = {Entity}Service()
    items = await service.get_multi(
        skip=skip, 
        limit=limit, 
        search=search,
        user_id=str(current_user.id)
    )
    total = await service.count(user_id=str(current_user.id), search=search)
    return {Entity}List(items=items, total=total, page=skip//limit + 1, size=limit)

@router.get("/{{{entity}_id}}", response_model={Entity}Response)
async def get_{entity}(
    {entity}_id: str,
    current_user = Depends(get_current_user)
):
    """Get a specific {entity}"""
    service = {Entity}Service()
    {entity} = await service.get({entity}_id, user_id=str(current_user.id))
    if not {entity}:
        raise HTTPException(status_code=404, detail="{Entity} not found")
    return {entity}

@router.put("/{{{entity}_id}}", response_model={Entity}Response)
async def update_{entity}(
    {entity}_id: str,
    {entity}_data: {Entity}Update,
    current_user = Depends(get_current_user)
):
    """Update a {entity}"""
    service = {Entity}Service()
    {entity} = await service.update({entity}_id, {entity}_data, user_id=str(current_user.id))
    if not {entity}:
        raise HTTPException(status_code=404, detail="{Entity} not found")
    return {entity}

@router.delete("/{{{entity}_id}}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_{entity}(
    {entity}_id: str,
    current_user = Depends(get_current_user)
):
    """Delete a {entity}"""
    service = {Entity}Service()
    success = await service.delete({entity}_id, user_id=str(current_user.id))
    if not success:
        raise HTTPException(status_code=404, detail="{Entity} not found")
```

### Service Layer
```python
# app/services/{entity}_service.py
from typing import List, Optional
from datetime import datetime
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException
from app.models.{entity} import {Entity}
from app.schemas.{entity} import {Entity}Create, {Entity}Update

class {Entity}Service:
    
    async def create(self, {entity}_data: {Entity}Create, user_id: str) -> {Entity}:
        try:
            {entity}_dict = {entity}_data.model_dump()
            {entity}_dict['user_id'] = user_id
            {entity} = {Entity}(**{entity}_dict)
            await {entity}.insert()
            return {entity}
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail="{Entity} with this name already exists")

    async def get(self, {entity}_id: str, user_id: str) -> Optional[{Entity}]:
        return await {Entity}.find_one(
            {Entity}.id == {entity}_id,
            {Entity}.user_id == user_id
        )

    async def get_multi(
        self, 
        skip: int = 0, 
        limit: int = 100, 
        search: Optional[str] = None,
        user_id: str = None
    ) -> List[{Entity}]:
        query_filter = {}
        
        if user_id:
            query_filter['user_id'] = user_id
            
        if search:
            query_filter['$text'] = {'$search': search}
            
        return await {Entity}.find(query_filter).skip(skip).limit(limit).to_list()

    async def update(self, {entity}_id: str, {entity}_data: {Entity}Update, user_id: str) -> Optional[{Entity}]:
        {entity} = await self.get({entity}_id, user_id)
        if not {entity}:
            return None
            
        update_data = {entity}_data.model_dump(exclude_unset=True)
        update_data['updated_at'] = datetime.utcnow()
        
        await {entity}.update({"$set": update_data})
        return await self.get({entity}_id, user_id)

    async def delete(self, {entity}_id: str, user_id: str) -> bool:
        {entity} = await self.get({entity}_id, user_id)
        if not {entity}:
            return False
            
        await {entity}.delete()
        return True

    async def count(self, user_id: str = None, search: Optional[str] = None) -> int:
        query_filter = {}
        
        if user_id:
            query_filter['user_id'] = user_id
            
        if search:
            query_filter['$text'] = {'$search': search}
            
        return await {Entity}.count(query_filter)
```

## Task Breakdown

### Phase 1: MongoDB Foundation (DatabaseArchitect)
- [ ] Design {Entity} Beanie document model with proper indexes
- [ ] Configure MongoDB connection and database initialization
- [ ] Add appropriate indexes for query optimization
- [ ] Validate document schema against requirements
- [ ] **Quality Gate**: MongoDB connected, documents created, indexes optimized

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
- [ ] Test MongoDB operations and queries
- [ ] Performance testing under load
- [ ] **Quality Gate**: Complete integration working, docs accurate

## Validation Commands

### Database Validation
```bash
# Test MongoDB connection
python -c "from app.core.database import init_db; import asyncio; asyncio.run(init_db())"

# Check collections and indexes
python -c "from motor.motor_asyncio import AsyncIOMotorClient; client = AsyncIOMotorClient('mongodb://localhost:27017'); db = client.test_db; print(db.list_collection_names())"
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
- [ ] Beanie document model properly defined with indexes
- [ ] MongoDB connection established and tested
- [ ] Document indexes optimized for expected queries
- [ ] Text search indexes configured for search functionality
- [ ] Schema follows MongoDB best practices

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
- [ ] NoSQL injection protection verified
- [ ] Authorization checks on all protected endpoints
- [ ] Security headers configured

## Anti-Patterns to Avoid
- ❌ Don't use synchronous operations with async FastAPI
- ❌ Don't skip input validation on API endpoints
- ❌ Don't hardcode sensitive data (use environment variables)
- ❌ Don't return Beanie documents directly (use Pydantic schemas)
- ❌ Don't skip indexes for frequently queried fields
- ❌ Don't ignore proper HTTP status codes
- ❌ Don't skip authentication on protected endpoints

## Final Validation Checklist
- [ ] All API endpoints working correctly
- [ ] MongoDB documents properly designed with indexes
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
- Use MongoDB connection pooling for scalability
- Leverage MongoDB's aggregation framework for complex queries