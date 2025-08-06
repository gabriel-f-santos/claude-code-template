from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.database import engine, Base
from app.routers import users_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title="FastAPI SQLAlchemy Async Template",
    description="Template base para projetos FastAPI com SQLAlchemy async",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(users_router)

@app.get("/")
def read_root():
    return {"message": "FastAPI SQLAlchemy Async Template funcionando!"}