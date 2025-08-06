import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app
from src.core.database import get_db, Base

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_account():
    response = client.post(
        "/accounts/",
        json={"username": "testuser", "email": "test@example.com", "password": "testpass123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_login():
    # First create a user
    client.post(
        "/accounts/",
        json={"username": "loginuser", "email": "login@example.com", "password": "loginpass123"}
    )
    
    # Then try to login
    response = client.post(
        "/auth/login",
        json={"username": "loginuser", "password": "loginpass123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == "loginuser"

def test_login_invalid_credentials():
    response = client.post(
        "/auth/login",
        json={"username": "nonexistent", "password": "wrongpass"}
    )
    assert response.status_code == 401

def test_get_account():
    # Create a user first
    create_response = client.post(
        "/accounts/",
        json={"username": "getuser", "email": "get@example.com", "password": "getpass123"}
    )
    user_id = create_response.json()["id"]
    
    # Get the user
    response = client.get(f"/accounts/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "getuser"

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "FastAPI SQLAlchemy Modular Template funcionando!"}