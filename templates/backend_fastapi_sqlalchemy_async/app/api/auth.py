from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_async_session
from ..core.security import get_current_user
from ..models.user import User
from ..schemas.auth import (
    UserCreate,
    UserRegister, 
    UserLogin, 
    UserResponse, 
    TokenResponse, 
    RefreshTokenResponse,
    UserUpdate, 
    PasswordChange, 
    MessageResponse
)
from ..services.auth_service import AuthService
from ..core.security import create_access_token
from ..core.config import settings
from ..services.auth_service import AuthService
from ..core.security import create_access_token


router = APIRouter(prefix="/auth")


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_async_session)
):
    """
    Registrar novo usuário
    
    - **email**: Email único válido  
    - **password**: Senha forte (min 8 chars, maiúscula, minúscula, número, especial)
    - **confirm_password**: Confirmação da senha
    """
    return await AuthService.register_user(session, user_data)


@router.post("/login", response_model=TokenResponse)
async def login_user(
    login_data: UserLogin,
    session: AsyncSession = Depends(get_async_session)
):
    """
    Fazer login com email e senha
    
    Retorna token JWT com dados do usuário
    """
    return await AuthService.login_user(session, login_data)


@router.post("/refresh", response_model=RefreshTokenResponse)
async def refresh_token(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Renovar token de acesso
    
    Requer token válido no header Authorization
    """

    
    access_token = create_access_token(
        data={"sub": current_user.email, "user_public_id": str(current_user.public_id)}
    )
    
    return RefreshTokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post("/logout", response_model=MessageResponse)
async def logout_user(
    current_user: User = Depends(get_current_user)
):
    """
    Fazer logout do usuário
    
    Invalida o token atual (implementação básica)
    """
    return MessageResponse(message="Logout realizado com sucesso")


@router.get("/me", response_model=UserResponse)
async def get_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Obter perfil do usuário atual
    
    Retorna dados do usuário autenticado
    """
    return UserResponse.model_validate(current_user)


@router.put("/me", response_model=UserResponse)
async def update_user_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Atualizar perfil do usuário
    
    - **email**: Novo email (opcional)
    - **full_name**: Nome completo (opcional)
    - **bio** / **avatar_url**: Campos adicionais
    """

    
    token = create_access_token(data={"sub": current_user.email, "user_public_id": str(current_user.public_id)})
    
    return await AuthService.update_user_profile(session, token, update_data)


@router.put("/change-password", response_model=MessageResponse)
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Alterar senha do usuário
    
    - **current_password**: Senha atual
    - **new_password**: Nova senha (mesmas regras do registro)
    - **confirm_password**: Confirmação da nova senha
    """

    
    token = create_access_token(data={"sub": current_user.email, "user_public_id": str(current_user.public_id)})
    
    result = await AuthService.change_password(session, token, password_data)
    return MessageResponse(message=result["message"])