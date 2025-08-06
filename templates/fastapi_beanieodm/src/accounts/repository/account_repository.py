from datetime import datetime
from typing import Optional, List
from beanie import PydanticObjectId

from src.shared.models.user import User
from src.core.auth import get_password_hash, verify_password


class AccountRepository:
    
    async def create_user(self, username: str, email: str, password: str) -> User:
        """Create a new user"""
        hashed_password = get_password_hash(password)
        user = User(
            username=username,
            email=email,
            hashed_password=hashed_password,
            created_at=datetime.utcnow()
        )
        await user.create()
        return user

    async def get_user_by_id(self, user_id: PydanticObjectId) -> Optional[User]:
        """Get user by ID"""
        return await User.get(user_id)

    async def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        return await User.find_one(User.username == username)

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return await User.find_one(User.email == email)

    async def get_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Get users with pagination"""
        return await User.find().skip(skip).limit(limit).to_list()

    async def update_user(self, user_id: PydanticObjectId, **kwargs) -> Optional[User]:
        """Update user"""
        user = await self.get_user_by_id(user_id)
        if not user:
            return None
        
        # Handle password update
        if "password" in kwargs:
            kwargs["hashed_password"] = get_password_hash(kwargs.pop("password"))
        
        # Add updated timestamp
        kwargs["updated_at"] = datetime.utcnow()
        
        # Update user
        await user.update({"$set": kwargs})
        
        # Return updated user
        return await self.get_user_by_id(user_id)

    async def delete_user(self, user_id: PydanticObjectId) -> bool:
        """Delete user"""
        user = await self.get_user_by_id(user_id)
        if not user:
            return False
        
        await user.delete()
        return True

    async def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """Authenticate user by username and password"""
        user = await self.get_user_by_username(username)
        if not user:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
        
        return user

    async def user_exists(self, username: str = None, email: str = None) -> bool:
        """Check if user exists by username or email"""
        if username and email:
            user = await User.find_one({
                "$or": [
                    {"username": username},
                    {"email": email}
                ]
            })
        elif username:
            user = await self.get_user_by_username(username)
        elif email:
            user = await self.get_user_by_email(email)
        else:
            return False
        
        return user is not None

    async def count_users(self) -> int:
        """Count total users"""
        return await User.find().count()

    async def find_active_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Find only active users"""
        return await User.find(User.is_active == True).skip(skip).limit(limit).to_list()