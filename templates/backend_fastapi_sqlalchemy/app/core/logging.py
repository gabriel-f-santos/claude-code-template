"""
Secure logging configuration for FastAPI SQLAlchemy
Implements structured logging with security best practices
"""
import logging
import logging.config
import json
import traceback
from typing import Any, Dict, Optional
from datetime import datetime
from .config import settings


class SecurityFilter(logging.Filter):
    """Filter that removes sensitive information from logs"""
    
    SENSITIVE_FIELDS = {
        'password', 'passwd', 'pwd', 'secret', 'key', 'token', 
        'credential', 'auth', 'session', 'cookie', 'hashed_password'
    }
    
    def filter(self, record: logging.LogRecord) -> bool:
        """Remove sensitive data from log messages"""
        if hasattr(record, 'msg') and isinstance(record.msg, str):
            # Replace sensitive field values in JSON-like strings
            for field in self.SENSITIVE_FIELDS:
                if field in record.msg.lower():
                    record.msg = record.msg.replace(
                        record.msg, 
                        self._mask_sensitive_data(record.msg, field)
                    )
        return True
    
    def _mask_sensitive_data(self, message: str, field: str) -> str:
        """Mask sensitive data in log messages"""
        import re
        # Pattern to match field: "value" or field=value
        pattern = rf'({field}["\']?\s*[:=]\s*["\']?)([^"\'\\s,}}]+)'
        return re.sub(pattern, r'\1***MASKED***', message, flags=re.IGNORECASE)


class StructuredFormatter(logging.Formatter):
    """Structured JSON formatter for production logs"""
    
    def format(self, record: logging.LogRecord) -> str:
        """Format log record as structured JSON"""
        log_entry = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno,
        }
        
        # Add exception info if present (but sanitized)
        if record.exc_info:
            log_entry['exception'] = self._format_exception_safely(record.exc_info)
        
        # Add extra fields if present
        if hasattr(record, 'user_id'):
            log_entry['user_id'] = str(record.user_id)  # Always string for privacy
        if hasattr(record, 'request_id'):
            log_entry['request_id'] = record.request_id
        if hasattr(record, 'operation'):
            log_entry['operation'] = record.operation
        
        return json.dumps(log_entry)
    
    def _format_exception_safely(self, exc_info) -> Dict[str, Any]:
        """Format exception info without sensitive data"""
        exc_type, exc_value, exc_traceback = exc_info
        
        # In production, only log exception type and sanitized message
        if settings.ENVIRONMENT == "production":
            return {
                'type': exc_type.__name__ if exc_type else 'Unknown',
                'message': 'Internal server error (details logged securely)'
            }
        
        # In development, include more details but still sanitized
        return {
            'type': exc_type.__name__ if exc_type else 'Unknown',
            'message': str(exc_value) if exc_value else 'No message',
            'traceback_lines': len(traceback.format_tb(exc_traceback)) if exc_traceback else 0
        }


def setup_logging():
    """Setup secure logging configuration"""
    
    # Base logging configuration
    config = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'structured': {
                '()': StructuredFormatter,
            },
            'simple': {
                'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            }
        },
        'filters': {
            'security': {
                '()': SecurityFilter,
            }
        },
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'level': 'INFO',
                'formatter': 'simple' if settings.ENVIRONMENT == 'development' else 'structured',
                'filters': ['security'],
            },
            'file': {
                'class': 'logging.handlers.RotatingFileHandler',
                'level': 'WARNING',
                'formatter': 'structured',
                'filters': ['security'],
                'filename': 'logs/app.log',
                'maxBytes': 10485760,  # 10MB
                'backupCount': 5,
            },
            'error_file': {
                'class': 'logging.handlers.RotatingFileHandler',
                'level': 'ERROR', 
                'formatter': 'structured',
                'filters': ['security'],
                'filename': 'logs/errors.log',
                'maxBytes': 10485760,  # 10MB
                'backupCount': 10,
            }
        },
        'loggers': {
            'app': {
                'level': 'DEBUG' if settings.ENVIRONMENT == 'development' else 'INFO',
                'handlers': ['console', 'file', 'error_file'],
                'propagate': False,
            },
            'security': {
                'level': 'WARNING',
                'handlers': ['file', 'error_file'],
                'propagate': False,
            },
            'performance': {
                'level': 'INFO',
                'handlers': ['file'],
                'propagate': False,
            }
        },
        'root': {
            'level': 'WARNING',
            'handlers': ['console'],
        }
    }
    
    # Apply logging configuration
    logging.config.dictConfig(config)
    
    # Create logs directory if it doesn't exist
    import os
    os.makedirs('logs', exist_ok=True)
    
    return logging.getLogger('app')


def get_logger(name: str = 'app') -> logging.Logger:
    """Get a logger instance with security filtering"""
    return logging.getLogger(name)


# Security logging helpers
def log_security_event(event: str, user_id: Optional[str] = None, details: Optional[Dict] = None):
    """Log security-related events"""
    security_logger = get_logger('security')
    extra = {'operation': 'security_event'}
    if user_id:
        extra['user_id'] = user_id
    
    message = f"Security event: {event}"
    if details:
        # Ensure no sensitive data in details
        safe_details = {k: v for k, v in details.items() 
                       if k.lower() not in SecurityFilter.SENSITIVE_FIELDS}
        message += f" - Details: {safe_details}"
    
    security_logger.warning(message, extra=extra)


def log_performance(operation: str, duration_ms: float, user_id: Optional[str] = None):
    """Log performance metrics"""
    perf_logger = get_logger('performance')
    extra = {'operation': operation, 'duration_ms': duration_ms}
    if user_id:
        extra['user_id'] = user_id
    
    perf_logger.info(f"Operation {operation} took {duration_ms}ms", extra=extra)