import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.main import app
from app.core.database import get_async_session, Base

# Create async test database
SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = async_sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)

async def override_get_async_session():
    """Override async database dependency for testing."""
    async with TestingSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

app.dependency_overrides[get_async_session] = override_get_async_session

@pytest_asyncio.fixture
async def async_client():
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Provide client
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    
    # Drop tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.mark.asyncio
async def test_root_endpoint(async_client: AsyncClient):
    """Test the root endpoint - Perfect for vibecoding demos!"""
    response = await async_client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "🚀" in data["message"]
    assert data["async"] is True
    assert "version" in data

@pytest.mark.asyncio
async def test_health_check(async_client: AsyncClient):
    """Test async health check endpoint."""
    response = await async_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "✅ Healthy (Async)" in data["status"]

@pytest.mark.asyncio
async def test_user_registration(async_client: AsyncClient):
    """Test async user registration."""
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    response = await async_client.post("/users/register", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == user_data["email"]
    assert "public_id" in data
    assert "hashed_password" not in data

@pytest.mark.asyncio
async def test_user_login(async_client: AsyncClient):
    """Test async user login flow."""
    # First register a user
    user_data = {
        "email": "login@example.com", 
        "password": "loginpassword123"
    }
    
    register_response = await async_client.post("/users/register", json=user_data)
    assert register_response.status_code == 201
    
    # Then login
    login_data = {
        "email": user_data["email"],
        "password": user_data["password"]
    }
    
    login_response = await async_client.post("/users/login", json=login_data)
    assert login_response.status_code == 200
    data = login_response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_get_users(async_client: AsyncClient):
    """Test getting users list asynchronously."""
    response = await async_client.get("/users/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

@pytest.mark.asyncio
async def test_duplicate_email(async_client: AsyncClient):
    """Test duplicate email registration."""
    user_data = {
        "email": "duplicate@example.com",
        "password": "testpassword123"
    }
    
    # First registration should succeed
    response1 = await async_client.post("/users/register", json=user_data)
    assert response1.status_code == 201
    
    # Second registration with same email should fail
    user_data2 = {
        "email": "duplicate@example.com",  # Same email
        "password": "testpassword123"
    }
    
    response2 = await async_client.post("/users/register", json=user_data2)
    assert response2.status_code == 400
    assert "already registered" in response2.json()["detail"]

@pytest.mark.asyncio
async def test_async_performance():
    """Test that demonstrates async performance benefits."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        import asyncio
        user_tasks = []
        for i in range(5):
            user_data = {
                "email": f"perf{i}@example.com",
                "password": "testpassword123"
            }
            task = client.post("/users/register", json=user_data)
            user_tasks.append(task)
        responses = await asyncio.gather(*user_tasks, return_exceptions=True)
        success_count = sum(1 for r in responses if hasattr(r, 'status_code') and r.status_code == 201)
        assert success_count == 5