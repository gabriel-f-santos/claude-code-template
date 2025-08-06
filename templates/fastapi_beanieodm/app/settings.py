from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env', env_file_encoding='utf-8'
    )

    MONGODB_URL: str = 'mongodb://localhost:27017'
    DATABASE_NAME: str = 'myapp'
    SECRET_KEY: str = 'fallback-secret-key'
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


settings = Settings()