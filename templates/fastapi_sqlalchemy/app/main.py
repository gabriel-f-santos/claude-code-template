from fastapi import FastAPI
from app.database import engine, Base
from app.routers import users_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FastAPI SQLAlchemy Template",
    description="Template base para projetos FastAPI com SQLAlchemy",
    version="1.0.0"
)

app.include_router(users_router)

@app.get("/")
def read_root():
    return {"message": "FastAPI SQLAlchemy Template funcionando!"}