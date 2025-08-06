from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.shared.models.user import User
from src.core.auth import get_password_hash, verify_password


class AccountRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_user(self, username: str, email: str, password: str) -> User:
        hashed_password = get_password_hash(password)
        user = User(
            username=username,
            email=email,
            hashed_password=hashed_password
        )
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        result = await self.session.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def get_user_by_username(self, username: str) -> Optional[User]:
        result = await self.session.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()

    async def get_user_by_email(self, email: str) -> Optional[User]:
        result = await self.session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        result = await self.session.execute(select(User).offset(skip).limit(limit))
        return result.scalars().all()

    async def update_user(self, user_id: int, **kwargs) -> Optional[User]:
        user = await self.get_user_by_id(user_id)
        if not user:
            return None
        
        if "password" in kwargs:
            kwargs["hashed_password"] = get_password_hash(kwargs.pop("password"))
        
        for field, value in kwargs.items():
            if hasattr(user, field):
                setattr(user, field, value)
        
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def delete_user(self, user_id: int) -> bool:
        user = await self.get_user_by_id(user_id)
        if not user:
            return False
        
        await self.session.delete(user)
        await self.session.commit()
        return True

    async def authenticate_user(self, username: str, password: str) -> Optional[User]:
        user = await self.get_user_by_username(username)
        if not user:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
        
        return user

    async def user_exists(self, username: str = None, email: str = None) -> bool:
        query = select(User)
        if username and email:
            query = query.where((User.username == username) | (User.email == email))
        elif username:
            query = query.where(User.username == username)
        elif email:
            query = query.where(User.email == email)
        else:
            return False
        
        result = await self.session.execute(query)
        return result.scalar_one_or_none() is not None