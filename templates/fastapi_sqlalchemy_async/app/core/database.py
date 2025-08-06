from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .config import settings

# Create async SQLAlchemy engine
async_engine = create_async_engine(
    settings.DATABASE_URL,
    # SQLite specific - remove for PostgreSQL/MySQL  
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    echo=settings.DEBUG  # Log SQL queries in debug mode
)

# Create AsyncSessionLocal class
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Create Base class for models
Base = declarative_base()


async def get_async_session() -> AsyncSession:
    """Async database dependency for FastAPI - Perfect for vibecoding!"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def create_tables():
    """Create all database tables asynchronously."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print(f"✅ Database tables created async: {settings.DATABASE_URL}")


async def drop_tables():
    """Drop all database tables asynchronously - Useful for development."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    print("🗑️ Database tables dropped async")


async def close_async_engine():
    """Close async database engine."""
    await async_engine.dispose()
    print("📴 Async database engine closed")