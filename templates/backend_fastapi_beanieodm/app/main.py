from fastapi import FastAPI
from contextlib import asynccontextmanager
from .core.config import settings
from .core.database import init_db, close_db
from .api.users import router as users_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events."""
    # Startup
    print("🚀 Starting FastAPI Beanie Vibecoding...")
    await init_db()
    yield
    # Shutdown
    print("📴 Shutting down...")
    await close_db()


def create_app() -> FastAPI:
    """Create and configure FastAPI app - Perfect for vibecoding!"""
    
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.VERSION,
        description="🚀 FastAPI + Beanie ODM for rapid development and vibecoding sessions!",
        lifespan=lifespan
    )

    # Include routers
    app.include_router(
        users_router,
        prefix="/users",
        tags=["👤 Users"]
    )

    @app.get("/")
    async def root():
        """Welcome endpoint - Great for testing!"""
        return {
            "message": "🚀 FastAPI Beanie Vibecoding API",
            "version": settings.VERSION,
            "docs": "/docs",
            "redoc": "/redoc"
        }

    @app.get("/health")
    async def health_check():
        """Health check endpoint"""
        return {"status": "✅ Healthy", "app": settings.APP_NAME}

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