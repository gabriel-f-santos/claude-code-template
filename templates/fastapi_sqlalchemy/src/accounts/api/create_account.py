from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.accounts.repository.account_repository import AccountRepository
from src.accounts.api.account_schemas import UserCreate, UserResponse

router = APIRouter(prefix="/accounts", tags=["accounts"])

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_account(user_data: UserCreate, db: Session = Depends(get_db)):
    repo = AccountRepository(db)
    
    if repo.user_exists(username=user_data.username, email=user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    user = repo.create_user(
        username=user_data.username,
        email=user_data.email,
        password=user_data.password
    )
    
    return user

@router.get("/{user_id}", response_model=UserResponse)
def get_account(user_id: int, db: Session = Depends(get_db)):
    repo = AccountRepository(db)
    user = repo.get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user