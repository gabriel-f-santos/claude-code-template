from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException, status, Depends, Query
from ..schemas.user import UserCreate, UserRead, UserUpdate, UserLogin, Token
from ..services.user_service import UserService
from ..core.security import get_current_user_email


router = APIRouter()


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    """🚀 Register a new user - Perfect for vibecoding demos!"""
    user = await UserService.create_user(user_data)
    return UserRead.model_validate(user.model_dump())


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """🔐 User login - Get access token"""
    access_token = await UserService.login_user(user_data.email, user_data.password)
    return Token(access_token=access_token)


@router.get("/me", response_model=UserRead)
async def get_current_user(current_user_email: str = Depends(get_current_user_email)):
    """👤 Get current user profile"""
    user = await UserService.get_user_by_email(current_user_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserRead.model_validate(user.model_dump())


@router.get("/", response_model=List[UserRead])
async def get_users(
    skip: int = Query(0, ge=0, description="Number of users to skip"),
    limit: int = Query(100, ge=1, le=100, description="Number of users to return")
):
    """📋 Get all users with pagination"""
    users = await UserService.get_users(skip=skip, limit=limit)
    return [UserRead.model_validate(user.model_dump()) for user in users]


@router.get("/{user_id}", response_model=UserRead)
async def get_user(user_id: PydanticObjectId):
    """👤 Get user by ID (secure ObjectId)"""
    user = await UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserRead.model_validate(user.model_dump())


@router.put("/{user_id}", response_model=UserRead)
async def update_user(
    user_id: PydanticObjectId,
    user_data: UserUpdate,
    current_user_email: str = Depends(get_current_user_email)
):
    """✏️ Update user information (secure ObjectId)"""
    # Optional: Add permission check here
    user = await UserService.update_user(user_id, user_data)
    return UserRead.model_validate(user.model_dump())


@router.delete("/{user_id}")
async def delete_user(
    user_id: PydanticObjectId,
    current_user_email: str = Depends(get_current_user_email)
):
    """🗑️ Delete user (secure ObjectId)"""
    # Optional: Add permission check here
    success = await UserService.delete_user(user_id)
    return {"message": "User deleted successfully"}