import pytest
from httpx import AsyncClient
from app.main import app


@pytest.fixture
async def client():
    """Create test client for FastAPI app."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


@pytest.mark.asyncio
async def test_root_endpoint(client: AsyncClient):
    """Test the root endpoint - Perfect for vibecoding demos!"""
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "🚀" in data["message"]
    assert "version" in data


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    """Test health check endpoint."""
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "✅ Healthy"


@pytest.mark.asyncio
async def test_user_registration(client: AsyncClient):
    """Test user registration - Great for live demos!"""
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    response = await client.post("/users/register", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == user_data["username"]
    assert data["email"] == user_data["email"]
    assert "id" in data


@pytest.mark.asyncio
async def test_user_login(client: AsyncClient):
    """Test user login flow."""
    # First register a user
    user_data = {
        "username": "logintest",
        "email": "login@example.com", 
        "password": "loginpassword123"
    }
    
    register_response = await client.post("/users/register", json=user_data)
    assert register_response.status_code == 201
    
    # Then login
    login_data = {
        "email": user_data["email"],
        "password": user_data["password"]
    }
    
    login_response = await client.post("/users/login", json=login_data)
    assert login_response.status_code == 200
    data = login_response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_get_users(client: AsyncClient):
    """Test getting users list."""
    response = await client.get("/users/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)