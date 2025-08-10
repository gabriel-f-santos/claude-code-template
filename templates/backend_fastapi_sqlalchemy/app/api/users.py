import uuid
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..schemas.user import UserCreate, UserRead, UserUpdate, UserLogin, Token
from ..services.user_service import UserService
from ..core.security import get_current_user_email


router = APIRouter()


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """🚀 Register a new user - Perfect for vibecoding demos!"""
    user = UserService.create_user(db, user_data)
    return user


@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """🔐 User login - Get access token"""
    access_token = UserService.login_user(db, user_data.email, user_data.password)
    return Token(access_token=access_token)


@router.get("/me", response_model=UserRead)
def get_current_user(
    current_user_email: str = Depends(get_current_user_email),
    db: Session = Depends(get_db)
):
    """👤 Get current user profile"""
    user = UserService.get_user_by_email(db, current_user_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.get("/", response_model=List[UserRead])
def get_users(
    skip: int = Query(0, ge=0, description="Number of users to skip"),
    limit: int = Query(100, ge=1, le=100, description="Number of users to return"),
    db: Session = Depends(get_db)
):
    """📋 Get all users with pagination"""
    users = UserService.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/{public_id}", response_model=UserRead)
def get_user(public_id: uuid.UUID, db: Session = Depends(get_db)):
    """👤 Get user by public_id (secure)"""
    user = UserService.get_user_by_public_id(db, public_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.put("/{public_id}", response_model=UserRead)
def update_user(
    public_id: uuid.UUID,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    """✏️ Update user information (secure)"""
    # Optional: Add permission check here
    user = UserService.update_user(db, public_id, user_data)
    return user


@router.delete("/{public_id}")
def delete_user(
    public_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    """🗑️ Delete user (secure)"""
    # Optional: Add permission check here
    success = UserService.delete_user(db, public_id)
    return {"message": "User deleted successfully"}