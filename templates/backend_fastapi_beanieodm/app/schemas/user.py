from datetime import datetime
from typing import Optional
from beanie import PydanticObjectId
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema with common fields."""
    username: str = Field(..., min_length=3, max_length=50, description="User's username")
    email: EmailStr = Field(..., description="User's email address")


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=6, description="User's password")


class UserUpdate(BaseModel):
    """Schema for updating user information."""
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None


class UserRead(UserBase):
    """Schema for reading user data (public info)."""
    id: PydanticObjectId = Field(..., description="User's unique identifier (secure ObjectId)")
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Note: MongoDB ObjectId is already secure (similar to UUID) and performant

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Schema for authentication token."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for token data."""
    email: Optional[str] = None