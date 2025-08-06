from datetime import datetime
from typing import Optional, List
from fastapi import HTTPException, status
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate
from ..core.security import get_password_hash, verify_password, create_access_token


class UserService:
    """Service class for user operations - perfect for vibecoding!"""

    @staticmethod
    async def create_user(user_data: UserCreate) -> User:
        """Create a new user."""
        # Check if user already exists
        existing_user = await User.find_one(User.email == user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check username
        existing_username = await User.find_one(User.username == user_data.username)
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Create user
        hashed_password = get_password_hash(user_data.password)
        user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password
        )
        
        await user.insert()
        return user

    @staticmethod
    async def get_user_by_email(email: str) -> Optional[User]:
        """Get user by email."""
        return await User.find_one(User.email == email)

    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[User]:
        """Get user by ID."""
        try:
            return await User.get(user_id)
        except:
            return None

    @staticmethod
    async def get_users(skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users with pagination."""
        return await User.find().skip(skip).limit(limit).to_list()

    @staticmethod
    async def update_user(user_id: str, user_data: UserUpdate) -> Optional[User]:
        """Update user information."""
        user = await User.get(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update fields
        update_data = user_data.model_dump(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            await user.update({"$set": update_data})
        
        return await User.get(user_id)

    @staticmethod
    async def delete_user(user_id: str) -> bool:
        """Delete user."""
        user = await User.get(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        await user.delete()
        return True

    @staticmethod
    async def authenticate_user(email: str, password: str) -> Optional[User]:
        """Authenticate user credentials."""
        user = await User.find_one(User.email == email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    async def login_user(email: str, password: str) -> str:
        """Login user and return access token."""
        user = await UserService.authenticate_user(email, password)
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