from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from decouple import config

DATABASE_URL = config('DATABASE_URL', default='sqlite+aiosqlite:///./test.db')

engine = create_async_engine(DATABASE_URL)
async_session = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_session():
    async with async_session() as session:
        yield session