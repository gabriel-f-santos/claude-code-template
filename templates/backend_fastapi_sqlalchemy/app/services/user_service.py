import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate
from ..core.security import get_password_hash, verify_password, create_access_token
from ..core.exceptions import AuthenticationError, ValidationError, NotFoundError
from ..core.logging import get_logger, log_security_event

logger = get_logger(__name__)


class UserService:
    """Service class for user operations - Perfect for vibecoding!"""

    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        """Create a new user."""
        # Check if user already exists
        existing_user = db.query(User).filter(
            or_(User.email == user_data.email, User.username == user_data.username)
        ).first()
        
        if existing_user:
            # Log security event - potential account enumeration attempt
            log_security_event(
                "duplicate_registration_attempt",
                details={
                    'attempted_email': user_data.email,
                    'attempted_username': user_data.username,
                    'conflict_type': 'email' if existing_user.email == user_data.email else 'username'
                }
            )
            
            if existing_user.email == user_data.email:
                logger.warning(f"Registration attempt with existing email: {user_data.email}")
                raise ValidationError("Email already registered")
            else:
                logger.warning(f"Registration attempt with existing username: {user_data.username}")
                raise ValidationError("Username already taken")
        
        # Create user
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email."""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_public_id(db: Session, public_id: uuid.UUID) -> Optional[User]:
        """Get user by public_id (secure API access)."""
        return db.query(User).filter(User.public_id == public_id).first()

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """Get user by internal ID (internal use only)."""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        """Get user by username."""
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users with pagination."""
        return db.query(User).offset(skip).limit(limit).all()

    @staticmethod
    def update_user(db: Session, public_id: uuid.UUID, user_data: UserUpdate) -> Optional[User]:
        """Update user information (using secure public_id)."""
        db_user = db.query(User).filter(User.public_id == public_id).first()
        if not db_user:
            logger.warning(f"Update attempt on non-existent user: {public_id}")
            raise NotFoundError("User")
        
        # Update fields
        update_data = user_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        # Set updated timestamp
        db_user.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def delete_user(db: Session, public_id: uuid.UUID) -> bool:
        """Delete user (using secure public_id)."""
        db_user = db.query(User).filter(User.public_id == public_id).first()
        if not db_user:
            logger.warning(f"Update attempt on non-existent user: {public_id}")
            raise NotFoundError("User")
        
        db.delete(db_user)
        db.commit()
        return True

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate user credentials."""
        user = UserService.get_user_by_email(db, email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def login_user(db: Session, email: str, password: str) -> str:
        """Login user and return access token."""
        user = UserService.authenticate_user(db, email, password)
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
                user_id=str(user.public_id),
                details={'email': email}
            )
            logger.warning(f"Login attempt on disabled account: {email}")
            raise AuthenticationError("Account is disabled")
        
        access_token = create_access_token(data={"sub": user.email})
        return access_token