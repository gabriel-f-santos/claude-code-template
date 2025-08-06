from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.core.database import engine, Base
from src.accounts.api.create_account import router as create_account_router
from src.accounts.api.login import router as login_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title="FastAPI SQLAlchemy Async Modular Template",
    description="Template modular async para projetos FastAPI com SQLAlchemy",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(create_account_router)
app.include_router(login_router)

@app.get("/")
def read_root():
    return {"message": "FastAPI SQLAlchemy Async Modular Template funcionando!"}