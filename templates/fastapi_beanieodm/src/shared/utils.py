from typing import Dict, Any, Optional, List
from datetime import datetime, timezone
from beanie import Document


def to_dict(obj: Document) -> Dict[str, Any]:
    """Convert Beanie Document instance to dictionary."""
    return obj.dict()


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


async def paginate_documents(
    document_class: type[Document], 
    page: int = 1, 
    per_page: int = 20,
    **filters
) -> List[Document]:
    """Paginate Beanie documents."""
    skip = (page - 1) * per_page
    
    if filters:
        query = document_class.find(filters)
    else:
        query = document_class.find()
    
    return await query.skip(skip).limit(per_page).to_list()


async def count_documents(document_class: type[Document], **filters) -> int:
    """Count documents with optional filters."""
    if filters:
        return await document_class.find(filters).count()
    else:
        return await document_class.find().count()