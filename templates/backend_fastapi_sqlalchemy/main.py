"""
🚀 FastAPI SQLAlchemy Vibecoding Template

Simple, modular structure perfect for rapid development and live coding sessions!
"""

from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0", 
        port=8000,
        reload=True
    )