# 🚀 FastAPI SQLAlchemy Async Vibecoding Template

## Vibecoding Architecture (Async) - Perfect for Live Coding!

This template follows the **vibecoding** philosophy: simple, modular, demonstrable code perfect for rapid development (15-minute features) and live coding sessions with Claude Code subagents.

## 🏗️ Simple Vibecoding Structure
```
├── app/                   # Main app directory
│   ├── api/              # REST endpoints (async)
│   │   └── users.py      # User endpoints
│   ├── core/             # App core (config, DB)
│   │   ├── database.py   # Async database setup
│   │   └── settings.py   # Environment settings
│   ├── models/           # SQLAlchemy async models
│   │   └── user.py       # User model
│   ├── schemas/          # Pydantic schemas
│   │   └── user.py       # User schemas
│   ├── services/         # Business logic (async)
│   │   └── user_service.py # User service with async CRUD
│   └── main.py          # FastAPI async app
├── tests/               # Async tests
│   └── test_users.py    # User tests with performance demo
└── requirements.txt     # All async dependencies
```

## ⚡ Quick Start Commands
```bash
# Install dependencies
pip install -r requirements.txt

# Run development server  
uvicorn app.main:app --reload

# Run async tests (with performance demo)
pytest tests/test_users.py -v

# Test a complete feature in < 15 minutes!
curl -X POST "http://localhost:8000/users/register" \
     -H "Content-Type: application/json" \
     -d '{"username": "demo", "email": "demo@example.com", "password": "demo123"}'
```

## 🔥 Vibecoding Async Patterns  

### Simple Async Service Pattern
Business logic in clean services - perfect for demos:
```python
class UserService:
    @staticmethod
    async def create_user(session: AsyncSession, user_data: UserCreate) -> User:
        # Hash password and create user
        user = User(username=user_data.username, email=user_data.email, ...)
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user
    
    @staticmethod
    async def authenticate(session: AsyncSession, email: str, password: str) -> Optional[User]:
        # Async authentication logic
        result = await session.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        # Verify password and return user
```

### Clean Async API Endpoints
Endpoints that showcase async power:
```python
@router.post("/register", response_model=UserResponse, status_code=201)
async def register_user(
    user_data: UserCreate, 
    session: AsyncSession = Depends(get_async_session)
) -> UserResponse:
    # Check if user exists (async)
    if await UserService.get_user_by_email(session, user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user (async)
    user = await UserService.create_user(session, user_data)
    return UserResponse.model_validate(user)
```

### Modern Async Database
SQLAlchemy 2.0 with async session management:
```python
async def get_async_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

## 🤖 Claude Code Subagent Prompts

### Vibecoding Async Feature Developer
**Perfect for rapid 15-minute feature development!**

```
You are a Vibecoding Async Expert specializing in FastAPI SQLAlchemy async applications.

CONTEXT: This project uses the vibecoding architecture:
- Simple modular structure: app/{api,core,models,schemas,services}
- Focus on rapid development (5-15 minutes for complete features)  
- Async patterns with SQLAlchemy 2.0
- Service pattern for business logic
- Clean, demonstrable code for live coding

VIBECODING PRINCIPLES:
- Keep it simple and fast
- One service per domain (UserService, PostService, etc.)
- Clean async patterns (async def, await, AsyncSession)
- Modern SQLAlchemy 2.0 select() syntax
- Comprehensive but focused endpoints
- Great for demos and live coding

EXAMPLE TASK:
"Create a complete 'posts' feature with async CRUD operations, user relationships, and proper error handling. Follow the vibecoding service pattern and make it ready to demo in 15 minutes."

WHAT TO INCLUDE:
1. Models (app/models/post.py) 
2. Schemas (app/schemas/post.py)
3. Service (app/services/post_service.py) with async CRUD
4. API endpoints (app/api/posts.py) with full REST API
5. Tests (tests/test_posts.py) with async patterns
```

### Vibecoding Async Performance Expert  
**For high-performance async optimizations!**

```
You are a Vibecoding Async Performance Expert.

CONTEXT: This FastAPI SQLAlchemy async app prioritizes performance while maintaining simplicity.

FOCUS ON:
- Connection pooling optimization
- Bulk async operations for multiple records
- Efficient queries with proper indexing
- Concurrent operations with asyncio.gather()
- Memory-efficient pagination
- Async transaction patterns

VIBECODING PERFORMANCE PATTERNS:
- Use bulk_insert_mappings() for multiple records
- Implement efficient pagination with limit/offset
- Add proper database indexes
- Use select() with join strategies
- Connection pool tuning for high concurrency

EXAMPLE TASK:
"Optimize the UserService for handling 1000+ concurrent user registrations with bulk operations, connection pooling, and performance monitoring."
```

### Vibecoding Async Troubleshooter
**For debugging and fixing async issues!**

```
You are a Vibecoding Async Troubleshooting Expert.

SPECIALIZES IN:
- Async/await debugging
- SQLAlchemy async session issues  
- Connection pooling problems
- Race condition detection
- Performance bottleneck identification
- Test async issues (pytest-asyncio)

COMMON ASYNC ISSUES TO SOLVE:
- "RuntimeError: asyncio.run() cannot be called from a running event loop"
- Session lifecycle management
- Proper transaction handling
- Memory leaks in connection pools
- Async context manager usage

VIBECODING DEBUGGING APPROACH:
- Focus on simple, clear solutions
- Provide working code examples
- Explain the root cause briefly
- Ensure solution works in live demos
```

## ⚡ Vibecoding Async Benefits

### 🚀 **Lightning Fast Development**
- Complete features in 15 minutes 
- Live coding ready
- Perfect for demonstrations
- Claude Code subagent optimized

### 💪 **Async Performance**
- Non-blocking I/O operations
- High concurrency support  
- Efficient resource utilization
- Modern SQLAlchemy 2.0 patterns

### 🎯 **Simple & Clean**
- Clear service pattern
- Focused business logic
- Easy to understand and maintain
- Great for rapid prototyping

### 🔧 **Production Ready**
- Connection pooling
- Proper error handling
- Comprehensive testing
- Multiple database support (SQLite, PostgreSQL, MySQL)

## 🔄 Key Differences from Sync Version

### Async Database Operations
```python
# Sync version
user = session.query(User).filter(User.email == email).first()

# Async version  
result = await session.execute(select(User).where(User.email == email))
user = result.scalar_one_or_none()
```

### Async Service Methods
```python
# All service methods are async
async def create_user(session: AsyncSession, user_data: UserCreate) -> User:
    # Implementation with await
```

### Async API Endpoints
```python
# All endpoints use async/await
@router.post("/register")
async def register_user(
    user_data: UserCreate, 
    session: AsyncSession = Depends(get_async_session)
):
    user = await UserService.create_user(session, user_data)
    return user
```

## 🔧 Environment Setup

Copy `.env.example` to `.env` and customize:

```bash
# 🚀 FastAPI SQLAlchemy Async Vibecoding Configuration

# App Settings
APP_NAME="FastAPI SQLAlchemy Async Vibecoding"
VERSION="1.0.0"
DEBUG=true

# Async Database (choose one)
# SQLite async (default - great for demos)
DATABASE_URL="sqlite+aiosqlite:///./vibecoding_async.db"

# PostgreSQL async (production ready)
# DATABASE_URL="postgresql+asyncpg://user:password@localhost:5432/vibecoding_db"

# Security (CHANGE IN PRODUCTION!)
SECRET_KEY="your-super-secret-key-change-in-production-please"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🎯 Perfect for Live Coding Sessions!

This template is specifically designed for:
- **Claude Code subagent development**
- **Live coding demonstrations**  
- **Rapid feature development**
- **Teaching async Python patterns**
- **Building MVPs quickly**

Start coding and see results in minutes, not hours! 🚀