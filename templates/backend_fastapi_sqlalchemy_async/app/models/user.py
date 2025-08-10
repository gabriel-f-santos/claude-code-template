from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from ..core.database import Base
from ..security.identifiers import DualIdMixin


class User(Base, DualIdMixin):
    """Async User model for SQLAlchemy with dual ID pattern."""
    
    __tablename__ = "users"
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    last_login = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)

    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"