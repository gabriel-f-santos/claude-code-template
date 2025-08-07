from fastapi import FastAPI
from .core.config import settings
from .core.database import create_tables
from .api.users import router as users_router


def create_app() -> FastAPI:
    """Create and configure FastAPI app - Perfect for vibecoding!"""
    
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.VERSION,
        description="🚀 FastAPI + SQLAlchemy for rapid development and vibecoding sessions!",
    )

    # Create database tables on startup
    create_tables()

    # Include routers
    app.include_router(
        users_router,
        prefix="/users",
        tags=["👤 Users"]
    )

    @app.get("/")
    def root():
        """Welcome endpoint - Great for testing!"""
        return {
            "message": "🚀 FastAPI SQLAlchemy Vibecoding API",
            "version": settings.VERSION,
            "docs": "/docs",
            "redoc": "/redoc"
        }

    @app.get("/health")
    def health_check():
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