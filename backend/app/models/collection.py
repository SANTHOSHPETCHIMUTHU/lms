from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, String, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

class CollectionCase(Base):
    __tablename__ = "collection_cases"
    id = Column(Integer, primary_key=True)
    loan_id = Column(Integer, ForeignKey("loans.id"))
    dpd_days = Column(Integer)
    overdue_amount = Column(DECIMAL(12,2))
    bucket = Column(String(50))
    assigned_officer_id = Column(Integer, ForeignKey("users.id"))
    legal_stage = Column(String(50))
    status = Column(String(50))
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())