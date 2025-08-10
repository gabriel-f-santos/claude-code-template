import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.main import app
from app.core.database import get_async_session, Base

# Create async test database
SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./test_auth.db"

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

# Helper fixture for test user data
@pytest.fixture
def valid_user_data():
    return {
        "email": "test@example.com",
        "password": "TestPass123!",
        "confirm_password": "TestPass123!"
    }

@pytest.fixture
def login_data():
    return {
        "email": "test@example.com",
        "password": "TestPass123!"
    }

# Authentication Tests

@pytest.mark.asyncio
async def test_register_user_success(async_client: AsyncClient, valid_user_data):
    """Test successful user registration with required fields."""
    response = await async_client.post("/api/auth/register", json=valid_user_data)
    
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == valid_user_data["email"]
    assert data["is_active"] is True
    assert data["is_verified"] is False
    assert "public_id" in data
    assert "created_at" in data
    assert "hashed_password" not in data  # Shouldn't expose password

@pytest.mark.asyncio
async def test_register_user_duplicate_email(async_client: AsyncClient, valid_user_data):
    """Test registration with duplicate email returns 409."""
    await async_client.post("/api/auth/register", json=valid_user_data)
    response = await async_client.post("/api/auth/register", json=valid_user_data)
    assert response.status_code == 409
    assert "Email já registrado" in response.json()["detail"]

@pytest.mark.asyncio
async def test_register_user_password_mismatch(async_client: AsyncClient, valid_user_data):
    """Test registration with password mismatch returns 422."""
    invalid_data = valid_user_data.copy()
    invalid_data["confirm_password"] = "DifferentPass123!"
    response = await async_client.post("/api/auth/register", json=invalid_data)
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_register_user_invalid_email(async_client: AsyncClient, valid_user_data):
    """Test registration with invalid email returns 422."""
    invalid_data = valid_user_data.copy()
    invalid_data["email"] = "invalid-email"
    response = await async_client.post("/api/auth/register", json=invalid_data)
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_register_user_weak_password(async_client: AsyncClient, valid_user_data):
    """Test registration with weak password returns 422."""
    invalid_data = valid_user_data.copy()
    invalid_data["password"] = "weak"
    invalid_data["confirm_password"] = "weak"
    response = await async_client.post("/api/auth/register", json=invalid_data)
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_login_user_success(async_client: AsyncClient, valid_user_data, login_data):
    """Test successful user login."""
    # First register user
    await async_client.post("/api/auth/register", json=valid_user_data)
    
    # Then login
    response = await async_client.post("/api/auth/login", json=login_data)
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in"] == 1800  # 30 minutes
    assert "user" in data
    assert data["user"]["email"] == login_data["email"]

@pytest.mark.asyncio
async def test_login_user_invalid_credentials(async_client: AsyncClient, valid_user_data):
    """Test login with invalid credentials returns 401."""
    # Register user first
    await async_client.post("/api/auth/register", json=valid_user_data)
    
    # Try login with wrong password
    invalid_login = {
        "email": valid_user_data["email"],
        "password": "WrongPassword123!"
    }
    
    response = await async_client.post("/api/auth/login", json=invalid_login)
    assert response.status_code == 401
    assert "Email ou senha inválidos" in response.json()["detail"]

@pytest.mark.asyncio
async def test_login_nonexistent_user(async_client: AsyncClient):
    """Test login with nonexistent user returns 401."""
    login_data = {
        "email": "nonexistent@example.com",
        "password": "TestPass123!"
    }
    
    response = await async_client.post("/api/auth/login", json=login_data)
    assert response.status_code == 401
    assert "Email ou senha inválidos" in response.json()["detail"]

@pytest.mark.asyncio
async def test_get_user_profile(async_client: AsyncClient, valid_user_data, login_data):
    """Test getting current user profile."""
    # Register and login user
    await async_client.post("/api/auth/register", json=valid_user_data)
    login_response = await async_client.post("/api/auth/login", json=login_data)
    token = login_response.json()["access_token"]
    
    # Get profile
    response = await async_client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == valid_user_data["email"]
    assert data["is_active"] is True

@pytest.mark.asyncio
async def test_get_user_profile_unauthorized(async_client: AsyncClient):
    """Test getting profile without token returns 401."""
    response = await async_client.get("/api/auth/me")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_user_profile_invalid_token(async_client: AsyncClient):
    """Test getting profile with invalid token returns 401."""
    response = await async_client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_update_user_profile(async_client: AsyncClient, valid_user_data, login_data):
    """Test updating user profile."""
    # Register and login user
    await async_client.post("/api/auth/register", json=valid_user_data)
    login_response = await async_client.post("/api/auth/login", json=login_data)
    token = login_response.json()["access_token"]
    
    # Update profile
    update_data = {
        "full_name": "Test User Full Name",
        "bio": "This is my bio"
    }
    
    response = await async_client.put(
        "/api/auth/me",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Test User Full Name"
    assert data["bio"] == "This is my bio"

@pytest.mark.asyncio
async def test_change_password(async_client: AsyncClient, valid_user_data, login_data):
    """Test changing user password."""
    # Register and login user
    await async_client.post("/api/auth/register", json=valid_user_data)
    login_response = await async_client.post("/api/auth/login", json=login_data)
    token = login_response.json()["access_token"]
    
    # Change password
    password_data = {
        "current_password": "TestPass123!",
        "new_password": "NewPass123!",
        "confirm_password": "NewPass123!"
    }
    
    response = await async_client.put(
        "/api/auth/change-password",
        json=password_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    assert response.json()["message"] == "Senha alterada com sucesso"
    
    # Test login with new password
    new_login_data = {
        "email": login_data["email"],
        "password": "NewPass123!"
    }
    
    new_login_response = await async_client.post("/api/auth/login", json=new_login_data)
    assert new_login_response.status_code == 200

@pytest.mark.asyncio
async def test_change_password_wrong_current(async_client: AsyncClient, valid_user_data, login_data):
    """Test changing password with wrong current password."""
    # Register and login user
    await async_client.post("/api/auth/register", json=valid_user_data)
    login_response = await async_client.post("/api/auth/login", json=login_data)
    token = login_response.json()["access_token"]
    
    # Try to change password with wrong current password
    password_data = {
        "current_password": "WrongCurrentPass123!",
        "new_password": "NewPass123!",
        "confirm_password": "NewPass123!"
    }
    
    response = await async_client.put(
        "/api/auth/change-password",
        json=password_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 400
    assert "Senha atual incorreta" in response.json()["detail"]

@pytest.mark.asyncio
async def test_refresh_token(async_client: AsyncClient, valid_user_data, login_data):
    """Test refreshing access token."""
    # Register and login user
    await async_client.post("/api/auth/register", json=valid_user_data)
    login_response = await async_client.post("/api/auth/login", json=login_data)
    token = login_response.json()["access_token"]
    
    # Refresh token
    response = await async_client.post(
        "/api/auth/refresh",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in"] == 1800

@pytest.mark.asyncio
async def test_logout_user(async_client: AsyncClient, valid_user_data, login_data):
    """Test user logout."""
    # Register and login user
    await async_client.post("/api/auth/register", json=valid_user_data)
    login_response = await async_client.post("/api/auth/login", json=login_data)
    token = login_response.json()["access_token"]
    
    # Logout
    response = await async_client.post(
        "/api/auth/logout",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    assert response.json()["message"] == "Logout realizado com sucesso"

@pytest.mark.asyncio
async def test_protected_endpoint_without_token(async_client: AsyncClient):
    """Test accessing protected endpoint without token."""
    endpoints = [
        "/api/auth/me",
        "/api/auth/refresh",
        "/api/auth/logout"
    ]
    
    for endpoint in endpoints:
        response = await async_client.get(endpoint)
        assert response.status_code == 401

@pytest.mark.asyncio
async def test_concurrent_user_registration(async_client: AsyncClient):
    """Test concurrent user registration to verify async performance."""
    import asyncio
    user_tasks = []
    for i in range(3):
        user_data = {
            "email": f"conc{i}@example.com",
            "password": "TestPass123!",
            "confirm_password": "TestPass123!"
        }
        task = async_client.post("/api/auth/register", json=user_data)
        user_tasks.append(task)
    responses = await asyncio.gather(*user_tasks, return_exceptions=True)
    success_count = sum(1 for r in responses if hasattr(r, 'status_code') and r.status_code == 201)
    assert success_count == 3