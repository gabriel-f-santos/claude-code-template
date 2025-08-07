"""
🚀 FastAPI SQLAlchemy Async Vibecoding Template

Async-native structure perfect for high-performance development and live coding sessions!
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