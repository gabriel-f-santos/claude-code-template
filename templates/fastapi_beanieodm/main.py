from fastapi import FastAPI
from contextlib import asynccontextmanager

from src.core.database import connect_to_mongo, close_mongo_connection, init_db
from src.accounts.api.create_account import router as create_account_router
from src.accounts.api.login import router as login_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    await init_db()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="FastAPI Beanie ODM Modular Template",
    description="Template modular async para projetos FastAPI com Beanie ODM e MongoDB",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(create_account_router)
app.include_router(login_router)

@app.get("/")
def read_root():
    return {"message": "FastAPI Beanie ODM Modular Template funcionando!"}