from uuid import uuid4
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError
import logging

logger = logging.getLogger(__name__)


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Global exception handler for unhandled errors.
    Returns generic message in production, logs full details.
    """
    correlation_id = str(uuid4())
    
    logger.exception(
        "global.unhandled_exception",
        extra={
            "correlation_id": correlation_id,
            "path": str(request.url),
            "method": request.method,
            "error_type": type(exc).__name__
        }
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "correlation_id": correlation_id
        }
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handle HTTP exceptions with correlation ID for 5xx errors"""
    
    if exc.status_code >= 500:
        correlation_id = str(uuid4())
        logger.error(
            "http.server_error",
            extra={
                "status_code": exc.status_code,
                "correlation_id": correlation_id,
                "path": str(request.url),
                "method": request.method
            }
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "detail": "Internal server error",
                "correlation_id": correlation_id
            }
        )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handle Pydantic validation errors"""
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": exc.errors()
        }
    )


async def integrity_error_handler(request: Request, exc: IntegrityError) -> JSONResponse:
    """Handle database integrity constraint errors"""
    correlation_id = str(uuid4())
    
    logger.warning(
        "database.integrity_error", 
        extra={
            "correlation_id": correlation_id,
            "constraint": str(exc.orig) if hasattr(exc, 'orig') else None
        }
    )
    
    # Generic message to avoid exposing database schema
    return JSONResponse(
        status_code=400,
        content={
            "detail": "Data constraint violation",
            "correlation_id": correlation_id
        }
    )