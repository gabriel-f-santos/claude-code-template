from typing import Dict, Any, Optional
from datetime import datetime, timezone


def to_dict(obj) -> Dict[str, Any]:
    """Convert SQLAlchemy model instance to dictionary."""
    if hasattr(obj, '__table__'):
        return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}
    return {}


def utc_now() -> datetime:
    """Get current UTC datetime."""
    return datetime.now(timezone.utc)


def format_datetime(dt: Optional[datetime], format_str: str = "%Y-%m-%d %H:%M:%S") -> Optional[str]:
    """Format datetime to string."""
    if dt is None:
        return None
    return dt.strftime(format_str)


def clean_dict(data: Dict[str, Any], exclude_none: bool = True) -> Dict[str, Any]:
    """Clean dictionary by removing None values and empty strings."""
    if not exclude_none:
        return data
    
    return {k: v for k, v in data.items() if v is not None and v != ""}


def paginate_query(query, page: int = 1, per_page: int = 20):
    """Add pagination to SQLAlchemy query."""
    offset = (page - 1) * per_page
    return query.offset(offset).limit(per_page)