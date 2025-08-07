from typing import List
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
    """🚀 Register a new user asynchronously - Perfect for vibecoding demos!"""
    user = await UserService.create_user(session, user_data)
    return user


@router.post("/login", response_model=Token)
async def login(
    user_data: UserLogin, 
    session: AsyncSession = Depends(get_async_session)
):
    """🔐 User login asynchronously - Get access token"""
    access_token = await UserService.login_user(session, user_data.email, user_data.password)
    return Token(access_token=access_token)


@router.get("/me", response_model=UserRead)
async def get_current_user(
    current_user_email: str = Depends(get_current_user_email),
    session: AsyncSession = Depends(get_async_session)
):
    """👤 Get current user profile asynchronously"""
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
    """📋 Get all users with pagination asynchronously"""
    users = await UserService.get_users(session, skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=UserRead)
async def get_user(user_id: int, session: AsyncSession = Depends(get_async_session)):
    """👤 Get user by ID asynchronously"""
    user = await UserService.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.put("/{user_id}", response_model=UserRead)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    current_user_email: str = Depends(get_current_user_email),
    session: AsyncSession = Depends(get_async_session)
):
    """✏️ Update user information asynchronously"""
    # Optional: Add permission check here
    user = await UserService.update_user(session, user_id, user_data)
    return user


@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    current_user_email: str = Depends(get_current_user_email),
    session: AsyncSession = Depends(get_async_session)
):
    """🗑️ Delete user asynchronously"""
    # Optional: Add permission check here
    success = await UserService.delete_user(session, user_id)
    return {"message": "User deleted successfully"}