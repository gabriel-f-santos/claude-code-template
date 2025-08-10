from datetime import datetime
from typing import Optional, List
from beanie import PydanticObjectId
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate
from ..core.security import get_password_hash, verify_password, create_access_token
from ..core.exceptions import AuthenticationError, ValidationError, NotFoundError
from ..core.logging import get_logger, log_security_event

logger = get_logger(__name__)


class UserService:
    """Service class for user operations - perfect for vibecoding!
    
    MongoDB ObjectId is already secure and performant - no need for dual ID system.
    ObjectId prevents enumeration attacks while maintaining excellent performance.
    """

    @staticmethod
    async def create_user(user_data: UserCreate) -> User:
        """Create a new user."""
        # Check if user already exists
        existing_user = await User.find_one(User.email == user_data.email)
        if existing_user:
            # Log security event - potential account enumeration attempt
            log_security_event(
                "duplicate_email_registration_attempt",
                details={'attempted_email': user_data.email}
            )
            logger.warning(f"Registration attempt with existing email: {user_data.email}")
            raise ValidationError("Email already registered")
        
        # Check username
        existing_username = await User.find_one(User.username == user_data.username)
        if existing_username:
            # Log security event - potential account enumeration attempt
            log_security_event(
                "duplicate_username_registration_attempt",
                details={'attempted_username': user_data.username}
            )
            logger.warning(f"Registration attempt with existing username: {user_data.username}")
            raise ValidationError("Username already taken")
        
        # Create user
        hashed_password = get_password_hash(user_data.password)
        user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password
        )
        
        await user.insert()
        return user

    @staticmethod
    async def get_user_by_email(email: str) -> Optional[User]:
        """Get user by email."""
        return await User.find_one(User.email == email)

    @staticmethod
    async def get_user_by_id(user_id: PydanticObjectId) -> Optional[User]:
        """Get user by ID."""
        try:
            return await User.get(user_id)
        except:
            return None

    @staticmethod
    async def get_users(skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users with pagination."""
        return await User.find().skip(skip).limit(limit).to_list()

    @staticmethod
    async def update_user(user_id: PydanticObjectId, user_data: UserUpdate) -> Optional[User]:
        """Update user information."""
        user = await User.get(user_id)
        if not user:
            logger.warning(f"Update attempt on non-existent user: {user_id}")
            raise NotFoundError("User")
        
        # Update fields
        update_data = user_data.model_dump(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            await user.update({"$set": update_data})
        
        return await User.get(user_id)

    @staticmethod
    async def delete_user(user_id: PydanticObjectId) -> bool:
        """Delete user."""
        user = await User.get(user_id)
        if not user:
            logger.warning(f"Update attempt on non-existent user: {user_id}")
            raise NotFoundError("User")
        
        await user.delete()
        return True

    @staticmethod
    async def authenticate_user(email: str, password: str) -> Optional[User]:
        """Authenticate user credentials."""
        user = await User.find_one(User.email == email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    async def login_user(email: str, password: str) -> str:
        """Login user and return access token."""
        user = await UserService.authenticate_user(email, password)
        if not user:
            # Log failed login attempt for security monitoring
            log_security_event(
                "failed_login_attempt",
                details={'email': email}
            )
            logger.warning(f"Failed login attempt for email: {email}")
            raise AuthenticationError("Invalid email or password")
        
        if not user.is_active:
            # Log attempt to access disabled account
            log_security_event(
                "disabled_account_access_attempt",
                user_id=str(user.id),
                details={'email': email}
            )
            logger.warning(f"Login attempt on disabled account: {email}")
            raise AuthenticationError("Account is disabled")
        
        access_token = create_access_token(data={"sub": user.email})
        return access_token