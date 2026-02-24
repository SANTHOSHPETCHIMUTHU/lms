from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    document_type = Column(String(50))
    file_path = Column(String(255))
    uploaded_at = Column(TIMESTAMP, server_default=func.now())
    verified = Column(Boolean, default=False)
    processing_status = Column(String(50))