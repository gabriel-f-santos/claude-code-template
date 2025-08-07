import motor.motor_asyncio
from beanie import init_beanie
from .config import settings
from ..models.user import User


async def init_db():
    """Initialize database connection and Beanie ODM."""
    client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
    database = client[settings.DATABASE_NAME]
    
    # Initialize Beanie with all document models
    await init_beanie(
        database=database,
        document_models=[User]  # Add new models here
    )
    
    print(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")


async def close_db():
    """Close database connection."""
    # Beanie handles connection cleanup automatically
    print("📴 Database connection closed")