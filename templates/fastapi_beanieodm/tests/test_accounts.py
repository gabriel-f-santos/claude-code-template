import pytest
import pytest_asyncio
from httpx import AsyncClient
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from main import app
from src.shared.models.user import User

# Test database
TEST_DATABASE_URL = "mongodb://localhost:27017"
TEST_DATABASE_NAME = "test_beanie_app"

@pytest_asyncio.fixture
async def async_client():
    # Setup test database
    client = AsyncIOMotorClient(TEST_DATABASE_URL)
    database = client[TEST_DATABASE_NAME]
    
    await init_beanie(database=database, document_models=[User])
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    
    # Cleanup
    await User.delete_all()
    client.close()

@pytest.mark.asyncio
async def test_create_account(async_client: AsyncClient):
    response = await async_client.post(
        "/accounts/",
        json={"username": "testuser", "email": "test@example.com", "password": "testpass123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert "id" in data

@pytest.mark.asyncio
async def test_login(async_client: AsyncClient):
    # First create a user
    await async_client.post(
        "/accounts/",
        json={"username": "loginuser", "email": "login@example.com", "password": "loginpass123"}
    )
    
    # Then try to login
    response = await async_client.post(
        "/auth/login",
        json={"username": "loginuser", "password": "loginpass123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == "loginuser"

@pytest.mark.asyncio
async def test_login_invalid_credentials(async_client: AsyncClient):
    response = await async_client.post(
        "/auth/login",
        json={"username": "nonexistent", "password": "wrongpass"}
    )
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_list_accounts(async_client: AsyncClient):
    response = await async_client.get("/accounts/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_read_root(async_client: AsyncClient):
    response = await async_client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "FastAPI Beanie ODM Modular Template funcionando!"}