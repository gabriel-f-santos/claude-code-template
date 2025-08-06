from fastapi import FastAPI
from src.core.database import engine, Base
from src.accounts.api.create_account import router as create_account_router
from src.accounts.api.login import router as login_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FastAPI SQLAlchemy Modular Template",
    description="Template modular para projetos FastAPI com SQLAlchemy",
    version="1.0.0"
)

app.include_router(create_account_router)
app.include_router(login_router)

@app.get("/")
def read_root():
    return {"message": "FastAPI SQLAlchemy Modular Template funcionando!"}