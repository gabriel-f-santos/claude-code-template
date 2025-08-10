import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from ..core.database import Base


class User(Base):
    """User model with dual ID system - Performance + Security!
    
    Uses internal integer PK for performance and public UUID for API security.
    Following industry standard pattern used by GitHub, Stripe, etc.
    """
    
    __tablename__ = "users"
    
    # Internal PK for performance - never exposed
    id = Column(Integer, primary_key=True, index=True)
    # Public UUID for external API - secure against enumeration
    public_id = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<User(id={str(self.id)}, username='{self.username}', email='{self.email}')>"