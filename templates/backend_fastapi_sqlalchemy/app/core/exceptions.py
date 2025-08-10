"""
Secure exception handling for FastAPI SQLAlchemy
Implements security-first error handling that prevents information disclosure
"""
import uuid
from typing import Any, Dict, Optional, Union
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

from .config import settings
from .logging import get_logger, log_security_event

logger = get_logger(__name__)


class BaseAPIException(HTTPException):
    """Base exception with secure error handling"""
    
    def __init__(
        self,
        status_code: int,
        detail: str,
        internal_message: Optional[str] = None,
        error_code: Optional[str] = None,
        headers: Optional[Dict[str, str]] = None
    ):
        self.error_id = str(uuid.uuid4())
        self.internal_message = internal_message or detail
        self.error_code = error_code
        
        # Log internal details securely
        logger.error(
            f"API Exception [{self.error_id}]: {self.internal_message}",
            extra={'error_code': error_code, 'error_id': self.error_id}
        )
        
        super().__init__(status_code=status_code, detail=detail, headers=headers)


class ValidationError(BaseAPIException):
    """Validation error with sanitized output"""
    
    def __init__(self, detail: str, field: Optional[str] = None):
        super().__init__(
            status_code=400,
            detail=f"Validation error{f' in field {field}' if field else ''}: {detail}",
            error_code="VALIDATION_ERROR"
        )


class AuthenticationError(BaseAPIException):
    """Authentication error - no sensitive info disclosed"""
    
    def __init__(self, detail: str = "Authentication failed"):
        # Security: Always use generic message externally
        super().__init__(
            status_code=401,
            detail="Authentication failed",  # Generic message
            internal_message=detail,  # Real reason logged internally
            error_code="AUTH_ERROR"
        )


class AuthorizationError(BaseAPIException):
    """Authorization error - no sensitive info disclosed"""
    
    def __init__(self, detail: str = "Access denied"):
        # Security: Always use generic message externally  
        super().__init__(
            status_code=403,
            detail="Access denied",  # Generic message
            internal_message=detail,  # Real reason logged internally
            error_code="AUTHZ_ERROR"
        )


class NotFoundError(BaseAPIException):
    """Not found error - prevents information disclosure"""
    
    def __init__(self, resource: str = "Resource"):
        # Security: Generic message to prevent resource enumeration
        super().__init__(
            status_code=404,
            detail="Resource not found",  # Generic message
            internal_message=f"{resource} not found",  # Specific resource logged
            error_code="NOT_FOUND"
        )


class BusinessLogicError(BaseAPIException):
    """Business logic error with safe messaging"""
    
    def __init__(self, detail: str, error_code: str = "BUSINESS_ERROR"):
        super().__init__(
            status_code=422,
            detail=detail,
            error_code=error_code
        )


class RateLimitError(BaseAPIException):
    """Rate limiting error"""
    
    def __init__(self, detail: str = "Too many requests"):
        super().__init__(
            status_code=429,
            detail=detail,
            error_code="RATE_LIMIT"
        )
        
        # Log potential attack
        log_security_event("rate_limit_exceeded", details={'detail': detail})


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Global HTTP exception handler with security features"""
    
    error_id = str(uuid.uuid4())
    
    # Log the actual error for debugging
    logger.error(
        f"HTTP Exception [{error_id}]: {exc.detail}",
        extra={
            'status_code': exc.status_code,
            'path': str(request.url.path),
            'method': request.method,
            'error_id': error_id
        }
    )
    
    # Determine response based on environment and status code
    if settings.ENVIRONMENT == "production" and exc.status_code >= 500:
        # In production, never expose internal server errors
        response_detail = "Internal server error"
        
        # Log security event for 500 errors (potential attacks)
        log_security_event(
            "internal_server_error",
            details={
                'path': str(request.url.path),
                'method': request.method,
                'status_code': exc.status_code
            }
        )
    else:
        # Safe to show client errors (4xx) or in development
        response_detail = exc.detail
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "message": response_detail,
                "error_id": error_id,
                "status_code": exc.status_code,
                # Only include error_code if it's a BaseAPIException
                **({"error_code": exc.error_code} if hasattr(exc, 'error_code') and exc.error_code else {})
            }
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handle validation errors securely"""
    
    error_id = str(uuid.uuid4())
    
    # Log validation error details internally
    logger.warning(
        f"Validation Error [{error_id}]: {exc.errors()}",
        extra={
            'path': str(request.url.path),
            'method': request.method,
            'error_id': error_id,
            'validation_errors': exc.errors()
        }
    )
    
    # Create safe error response
    if settings.ENVIRONMENT == "production":
        # In production, provide minimal validation error info
        response_detail = "Invalid request data"
        errors = [{"field": "request", "message": "Invalid data format"}]
    else:
        # In development, provide more details (but still sanitized)
        response_detail = "Validation failed"
        errors = []
        for error in exc.errors():
            # Sanitize error details
            field_path = ".".join(str(loc) for loc in error["loc"])
            safe_message = error["msg"]
            
            # Remove potentially sensitive information from validation messages
            if "password" in safe_message.lower() or "secret" in safe_message.lower():
                safe_message = "Invalid format"
            
            errors.append({
                "field": field_path,
                "message": safe_message
            })
    
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "message": response_detail,
                "error_id": error_id,
                "status_code": 422,
                "error_code": "VALIDATION_ERROR",
                "details": errors
            }
        }
    )


async def internal_server_error_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle unexpected internal server errors securely"""
    
    error_id = str(uuid.uuid4())
    
    # Log the full exception details internally
    logger.exception(
        f"Internal Server Error [{error_id}]: {str(exc)}",
        extra={
            'path': str(request.url.path),
            'method': request.method,
            'error_id': error_id,
            'exception_type': type(exc).__name__
        }
    )
    
    # Always log security event for 500 errors
    log_security_event(
        "unexpected_server_error",
        details={
            'path': str(request.url.path),
            'method': request.method,
            'exception_type': type(exc).__name__
        }
    )
    
    # Never expose internal error details in any environment
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "message": "Internal server error",
                "error_id": error_id,
                "status_code": 500,
                "error_code": "INTERNAL_ERROR"
            }
        }
    )


def setup_exception_handlers(app):
    """Setup all exception handlers for the FastAPI app"""
    
    # Custom exception handlers
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, internal_server_error_handler)
    
    logger.info("Secure exception handlers configured")