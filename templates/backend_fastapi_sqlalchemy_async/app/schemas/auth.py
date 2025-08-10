from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, field_validator
import re


class UserLogin(BaseModel):
    """Schema para login de usuário (email + senha)."""
    email: EmailStr
    password: str


class UserCreate(BaseModel):
    """Schema para criação/registro de usuário."""
    email: EmailStr
    password: str = Field(min_length=8)
    confirm_password: str
    
    @field_validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter') 
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v
    
    def model_post_init(self, __context) -> None:
        if self.password != self.confirm_password:
            raise ValueError('Passwords do not match')


# Alias para compatibilidade com código existente
UserRegister = UserCreate


class UserResponse(BaseModel):
    """Schema para resposta de dados do usuário (expondo apenas public_id)."""
    public_id: UUID  # era id (int interno) – agora apenas UUID externo
    email: str
    full_name: Optional[str] = None
    is_active: bool
    is_verified: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema para resposta do token de autenticação"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class RefreshTokenResponse(BaseModel):
    """Schema para resposta do refresh token"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserUpdate(BaseModel):
    """Schema para atualização do perfil do usuário."""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = None
    avatar_url: Optional[str] = Field(None, max_length=500)


class PasswordChange(BaseModel):
    """Schema para mudança de senha"""
    current_password: str
    new_password: str = Field(min_length=8)
    confirm_password: str
    
    @field_validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v
    
    def model_post_init(self, __context) -> None:
        if self.new_password != self.confirm_password:
            raise ValueError('New passwords do not match')


class MessageResponse(BaseModel):
    """Schema para resposta de mensagem simples"""
    message: str