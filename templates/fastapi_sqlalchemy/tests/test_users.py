import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    """Override database dependency for testing."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_root_endpoint():
    """Test the root endpoint - Perfect for vibecoding demos!"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "🚀" in data["message"]
    assert "version" in data


def test_health_check():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "✅ Healthy"


def test_user_registration():
    """Test user registration - Great for live demos!"""
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    response = client.post("/users/register", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == user_data["username"]
    assert data["email"] == user_data["email"]
    assert "id" in data


def test_user_login():
    """Test user login flow."""
    # First register a user
    user_data = {
        "username": "logintest",
        "email": "login@example.com", 
        "password": "loginpassword123"
    }
    
    register_response = client.post("/users/register", json=user_data)
    assert register_response.status_code == 201
    
    # Then login
    login_data = {
        "email": user_data["email"],
        "password": user_data["password"]
    }
    
    login_response = client.post("/users/login", json=login_data)
    assert login_response.status_code == 200
    data = login_response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_get_users():
    """Test getting users list."""
    response = client.get("/users/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_duplicate_email():
    """Test duplicate email registration."""
    user_data = {
        "username": "unique1",
        "email": "duplicate@example.com",
        "password": "testpassword123"
    }
    
    # First registration should succeed
    response1 = client.post("/users/register", json=user_data)
    assert response1.status_code == 201
    
    # Second registration with same email should fail
    user_data2 = {
        "username": "unique2",
        "email": "duplicate@example.com",  # Same email
        "password": "testpassword123"
    }
    
    response2 = client.post("/users/register", json=user_data2)
    assert response2.status_code == 400
    assert "already registered" in response2.json()["detail"]