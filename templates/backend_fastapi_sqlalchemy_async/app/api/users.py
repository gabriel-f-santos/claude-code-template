from typing import List
from uuid import UUID
from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_async_session
from ..schemas.user import UserCreate, UserRead, UserUpdate, UserLogin, Token
from ..services.user_service import UserService
from ..core.security import get_current_user_email


router = APIRouter()


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserCreate, 
    session: AsyncSession = Depends(get_async_session)
):
    """Register a new user (email + password only)."""
    user = await UserService.create_user(session, user_data)
    return user


@router.post("/login", response_model=Token)
async def login(
    user_data: UserLogin, 
    session: AsyncSession = Depends(get_async_session)
):
    """User login (email + password)."""
    access_token = await UserService.login_user(session, user_data.email, user_data.password)
    return Token(access_token=access_token)


@router.get("/me", response_model=UserRead)
async def get_current_user(
    current_user_email: str = Depends(get_current_user_email),
    session: AsyncSession = Depends(get_async_session)
):
    """Get current user profile."""
    user = await UserService.get_user_by_email(session, current_user_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.get("/", response_model=List[UserRead])
async def get_users(
    skip: int = Query(0, ge=0, description="Number of users to skip"),
    limit: int = Query(100, ge=1, le=100, description="Number of users to return"),
    session: AsyncSession = Depends(get_async_session)
):
    """Get all users with pagination."""
    users = await UserService.get_users(session, skip=skip, limit=limit)
    return users


@router.get("/{public_id}", response_model=UserRead)
async def get_user(public_id: UUID, session: AsyncSession = Depends(get_async_session)):
    """Get user by public ID."""
    user = await UserService.get_user_by_public_id(session, public_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.put("/{public_id}", response_model=UserRead)
async def update_user(
    public_id: UUID,
    user_data: UserUpdate,
    current_user_email: str = Depends(get_current_user_email),
    session: AsyncSession = Depends(get_async_session)
):
    """Update user information."""
    user = await UserService.update_user(session, public_id, user_data)
    return user


@router.delete("/{public_id}")
async def delete_user(
    public_id: UUID,
    current_user_email: str = Depends(get_current_user_email),
    session: AsyncSession = Depends(get_async_session)
):
    """Delete user."""
    await UserService.delete_user(session, public_id)
    return {"message": "User deleted successfully"}