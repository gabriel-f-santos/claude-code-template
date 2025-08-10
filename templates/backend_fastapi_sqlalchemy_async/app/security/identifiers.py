from uuid import uuid4
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declared_attr


class DualIdMixin:
    """
    Mixin para padrão dual ID: id (Integer PK interno) + public_id (UUID externo)
    
    Benefícios:
    - Performance: PK sequencial otimiza índices e JOINs
    - Segurança: UUID previne enumeration attacks
    - Escalabilidade: Facilita sharding futuro
    """
    
    @declared_attr
    def id(cls):
        """Primary Key interno - nunca expor via API"""
        return Column(Integer, primary_key=True, index=True)
    
    @declared_attr 
    def public_id(cls):
        """UUID público para APIs externas - compatível com SQLite e PostgreSQL"""
        return Column(
            String(36),  # String UUID for SQLite compatibility
            unique=True,
            nullable=False,
            default=lambda: str(uuid4()),
            index=True
        )