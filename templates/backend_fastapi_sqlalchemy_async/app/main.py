from contextlib import asynccontextmanager
from fastapi import FastAPI
from .core.config import settings
from .core.database import create_tables, close_async_engine
from .api.users import router as users_router
from .api.auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle async startup and shutdown events."""
    # Startup
    print("Starting FastAPI SQLAlchemy Async Vibecoding...")
    await create_tables()
    yield
    # Shutdown
    print("Shutting down async...")
    await close_async_engine()


def create_app() -> FastAPI:
    """Create and configure async FastAPI app - Perfect for vibecoding!"""
    
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.VERSION,
        description="FastAPI + SQLAlchemy Async for rapid development and vibecoding sessions",
        lifespan=lifespan
    )

    # Include routers
    app.include_router(
        users_router,
        prefix="/users",
        tags=["users"]
    )
    
    app.include_router(
        auth_router,
        prefix="/api",
        tags=["auth"]
    )

    @app.get("/")
    async def root():
        """Welcome endpoint - Great for testing async!"""
        return {
            "message": "FastAPI SQLAlchemy Async Vibecoding API",
            "version": settings.VERSION,
            "async": True,
            "docs": "/docs",
            "redoc": "/redoc"
        }

    @app.get("/health")
    async def health_check():
        """Async health check endpoint"""
        return {"status": "Healthy", "app": settings.APP_NAME}

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )