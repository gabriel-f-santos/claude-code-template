from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import EmailStr, Field


class User(Document):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr = Field(..., unique=True)
    hashed_password: str
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Settings:
        name = "users"
        indexes = [
            "email",
            "username",
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "username": "johndoe",
                "email": "john@example.com",
                "is_active": True,
            }
        }