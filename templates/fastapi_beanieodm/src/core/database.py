from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from src.core.settings import settings


class Database:
    client: AsyncIOMotorClient = None
    database = None


db = Database()


async def get_database() -> AsyncIOMotorClient:
    return db.client


async def connect_to_mongo():
    """Create database connection"""
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db.database = db.client[settings.DATABASE_NAME]


async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()


async def init_db():
    """Initialize database with Beanie"""
    from src.shared.models.user import User
    
    await init_beanie(
        database=db.database,
        document_models=[User]
    )