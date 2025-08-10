from datetime import datetime
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate
from ..core.security import get_password_hash, verify_password, create_access_token


class UserService:
    """Async service class for user operations."""

    @staticmethod
    async def create_user(session: AsyncSession, user_data: UserCreate) -> User:
        """Create a new user asynchronously."""
        # Check if email already exists
        stmt = select(User).where(User.email == user_data.email)
        result = await session.execute(stmt)
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password
        )
        
        session.add(db_user)
        await session.commit()
        await session.refresh(db_user)
        return db_user

    @staticmethod
    async def get_user_by_email(session: AsyncSession, email: str) -> Optional[User]:
        """Get user by email asynchronously."""
        stmt = select(User).where(User.email == email)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_by_public_id(session: AsyncSession, public_id: str) -> Optional[User]:
        """Get user by public ID asynchronously."""
        stmt = select(User).where(User.public_id == public_id)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_users(session: AsyncSession, skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users with pagination asynchronously."""
        stmt = select(User).offset(skip).limit(limit)
        result = await session.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def update_user(session: AsyncSession, public_id: str, user_data: UserUpdate) -> Optional[User]:
        """Update user information asynchronously."""
        stmt = select(User).where(User.public_id == public_id)
        result = await session.execute(stmt)
        db_user = result.scalar_one_or_none()
        
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update fields
        update_data = user_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        # Set updated timestamp
        db_user.updated_at = datetime.utcnow()
        
        await session.commit()
        await session.refresh(db_user)
        return db_user

    @staticmethod
    async def delete_user(session: AsyncSession, public_id: str) -> bool:
        """Delete user asynchronously."""
        stmt = select(User).where(User.public_id == public_id)
        result = await session.execute(stmt)
        db_user = result.scalar_one_or_none()
        
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        await session.delete(db_user)
        await session.commit()
        return True

    @staticmethod
    async def authenticate_user(session: AsyncSession, email: str, password: str) -> Optional[User]:
        """Authenticate user credentials asynchronously."""
        user = await UserService.get_user_by_email(session, email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    async def login_user(session: AsyncSession, email: str, password: str) -> str:
        """Login user and return access token asynchronously."""
        user = await UserService.authenticate_user(session, email, password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User account is disabled"
            )
        
        access_token = create_access_token(data={"sub": user.email})
        return access_token