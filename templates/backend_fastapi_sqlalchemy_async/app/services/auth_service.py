from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from ..models.user import User
from ..schemas.auth import UserCreate, UserLogin, UserResponse, TokenResponse, UserUpdate, PasswordChange
from ..core.security import get_password_hash, verify_password, create_access_token, verify_token
from ..core.config import settings


class AuthService:
    """Service para operações de autenticação."""

    @staticmethod
    async def register_user(session: AsyncSession, user_data: UserCreate) -> UserResponse:
        """Registrar novo usuário com validação."""
        # Verificar se email já existe
        stmt = select(User).where(User.email == user_data.email)
        result = await session.execute(stmt)
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email já registrado"
            )
        
        # Criar usuário
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            is_active=True
        )
        
        session.add(db_user)
        await session.commit()
        await session.refresh(db_user)
        
        return UserResponse.model_validate(db_user)

    @staticmethod
    async def login_user(session: AsyncSession, login_data: UserLogin) -> TokenResponse:
        """Fazer login e retornar token de acesso"""
        # Buscar usuário por email
        stmt = select(User).where(User.email == login_data.email)
        result = await session.execute(stmt)
        user = result.scalar_one_or_none()
        
        # Verificar credenciais
        if not user or not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha inválidos"
            )
        
        # Verificar se usuário está ativo
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Conta de usuário desativada"
            )
        
        # Atualizar last_login
        user.last_login = datetime.utcnow()
        await session.commit()
        await session.refresh(user)
        
        # Gerar token
        access_token = create_access_token(
            data={"sub": user.email, "user_public_id": str(user.public_id)}
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=UserResponse.model_validate(user)
        )

    @staticmethod
    async def get_current_user(session: AsyncSession, token: str) -> User:
        """Obter usuário atual a partir do token"""
        try:
            # Verificar token
            token_data = verify_token(token)
            email = token_data["email"]
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Buscar usuário
        stmt = select(User).where(User.email == email)
        result = await session.execute(stmt)
        user = result.scalar_one_or_none()
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário não encontrado"
            )
        
        return user

    @staticmethod
    async def refresh_token(session: AsyncSession, token: str) -> TokenResponse:
        """Renovar token de acesso"""
        user = await AuthService.get_current_user(session, token)
        
        # Gerar novo token
        access_token = create_access_token(
            data={"sub": user.email, "user_public_id": str(user.public_id)}
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=UserResponse.model_validate(user)
        )

    @staticmethod
    async def get_user_profile(session: AsyncSession, token: str) -> UserResponse:
        """Obter perfil do usuário atual"""
        user = await AuthService.get_current_user(session, token)
        return UserResponse.model_validate(user)

    @staticmethod
    async def update_user_profile(
        session: AsyncSession, 
        token: str, 
        update_data: UserUpdate
    ) -> UserResponse:
        """Atualizar perfil do usuário."""
        user = await AuthService.get_current_user(session, token)
        
        # Verificar se novo email já existe
        if update_data.email and update_data.email != user.email:
            stmt = select(User).where(User.email == update_data.email)
            result = await session.execute(stmt)
            existing = result.scalar_one_or_none()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email já está em uso"
                )
        
        # Atualizar campos
        update_dict = update_data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(user, field, value)
        
        user.updated_at = datetime.utcnow()
        await session.commit()
        await session.refresh(user)
        
        return UserResponse.model_validate(user)

    @staticmethod
    async def change_password(
        session: AsyncSession, 
        token: str, 
        password_data: PasswordChange
    ) -> dict:
        """Alterar senha do usuário"""
        user = await AuthService.get_current_user(session, token)
        
        # Verificar senha atual
        if not verify_password(password_data.current_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Senha atual incorreta"
            )
        
        # Atualizar senha
        user.hashed_password = get_password_hash(password_data.new_password)
        user.updated_at = datetime.utcnow()
        
        await session.commit()
        
        return {"message": "Senha alterada com sucesso"}

    @staticmethod
    async def logout_user(session: AsyncSession, token: str) -> dict:
        """Fazer logout (invalidar token - implementação básica)"""
        # Verificar se token é válido
        await AuthService.get_current_user(session, token)
        
        return {"message": "Logout realizado com sucesso"}