from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_session
from src.core.auth import create_access_token
from src.accounts.repository.account_repository import AccountRepository
from src.accounts.api.account_schemas import LoginRequest, LoginResponse

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest, session: AsyncSession = Depends(get_session)):
    repo = AccountRepository(session)
    
    user = await repo.authenticate_user(login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    access_token = create_access_token(data={"sub": user.username})
    
    return LoginResponse(
        access_token=access_token,
        user=user
    )