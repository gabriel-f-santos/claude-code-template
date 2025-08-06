from fastapi import APIRouter, HTTPException, status
from beanie import PydanticObjectId

from src.accounts.repository.account_repository import AccountRepository
from src.accounts.api.account_schemas import UserCreate, UserResponse

router = APIRouter(prefix="/accounts", tags=["accounts"])

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_account(user_data: UserCreate):
    repo = AccountRepository()
    
    if await repo.user_exists(username=user_data.username, email=user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    user = await repo.create_user(
        username=user_data.username,
        email=user_data.email,
        password=user_data.password
    )
    
    return user

@router.get("/{user_id}", response_model=UserResponse)
async def get_account(user_id: PydanticObjectId):
    repo = AccountRepository()
    user = await repo.get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.get("/", response_model=list[UserResponse])
async def list_accounts(skip: int = 0, limit: int = 100):
    repo = AccountRepository()
    users = await repo.get_users(skip=skip, limit=limit)
    return users