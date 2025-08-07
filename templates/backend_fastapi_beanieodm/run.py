"""
🚀 FastAPI Beanie Vibecoding Runner

Simple runner script for development - perfect for vibecoding sessions!
"""

import uvicorn

if __name__ == "__main__":
    print("🚀 Starting FastAPI Beanie Vibecoding...")
    print("📖 API docs will be available at: http://localhost:8000/docs")
    print("🔄 Auto-reload is enabled for development")
    
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        reload_excludes=["*.log", "*.pyc", "__pycache__"]
    )