# 🚀 FastAPI SQLAlchemy Async Vibecoding Template

## Quick Start
```bash
# Install and run
pip install -r requirements.txt
uvicorn app.main:app --reload

# Test complete User feature
curl -X POST "http://localhost:8000/users/register" \
     -H "Content-Type: application/json" \
     -d '{"email": "demo@example.com", "password": "demo123"}'
```

## 🏗️ Vibecoding Structure
```
app/
├── api/users.py          # REST endpoints  
├── core/                 # Database & config
├── models/user.py        # SQLAlchemy model
├── schemas/user.py       # Pydantic schemas
├── services/user_service.py # Business logic
├── security/             # Security patterns
└── main.py              # FastAPI app
```

## 🔥 Complete User Example

### Model with Dual ID Pattern
```python
# app/models/user.py
from app.security.identifiers import DualIdMixin

class User(Base, DualIdMixin):
    __tablename__ = "users"
    
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### Secure Schema (Public ID Only)
```python  
# app/schemas/user.py
class UserRead(BaseModel):
    public_id: UUID  # Only expose UUID, never internal id
    email: EmailStr
    is_active: bool
    created_at: datetime
```

### Async Service Layer
```python
# app/services/user_service.py  
class UserService:
    @staticmethod
    async def create_user(session: AsyncSession, user_data: UserCreate) -> User:
        # Hash password and create user
        user = User(email=user_data.email, hashed_password=get_password_hash(user_data.password))
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user
```

### Secure API with Error Handling
```python
# app/api/users.py
@router.post("/register", response_model=UserRead)
async def register_user(user_data: UserCreate, session: AsyncSession = Depends(get_async_session)):
    try:
        # Check existing user by public_id lookup
        if await UserService.get_user_by_email(session, user_data.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user = await UserService.create_user(session, user_data)
        return UserRead.model_validate(user)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("user.registration_failed", extra={"email": user_data.email})
        raise HTTPException(status_code=500, detail="Registration failed")
```

## 🔐 Security Features

- **Dual ID Pattern**: Integer PK (performance) + UUID (security)  
- **No ID Enumeration**: APIs never expose sequential IDs
- **Secure Logging**: Correlation IDs, no sensitive data
- **PyJWT Integration**: Modern JWT handling
- **Global Error Handlers**: Consistent error responses

## 📚 Documentation

- [Architecture Rules](docs/architecture.md) - ALWAYS/NEVER patterns
- [Subagent Prompts](docs/prompts.md) - Claude Code helpers

## Development Commands

```bash
# Database migrations
alembic revision --autogenerate -m "Add feature"
alembic upgrade head

# Testing  
pytest tests/ -v

# Linting
ruff check app/
```