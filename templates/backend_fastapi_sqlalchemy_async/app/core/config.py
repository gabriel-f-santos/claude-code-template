from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True)
    
    # App
    APP_NAME: str = "FastAPI SQLAlchemy Async Vibecoding"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database - Async URLs
    DATABASE_URL: str = "sqlite+aiosqlite:///./vibecoding_async.db"
    # For PostgreSQL: "postgresql+asyncpg://user:password@localhost/dbname"
    # For MySQL: "mysql+aiomysql://user:password@localhost/dbname"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    GROQ_MODEL: str ="llama-3.1-70b-versatile"
    GROQ_API_KEY: str = "your-groq-api"


settings = Settings()