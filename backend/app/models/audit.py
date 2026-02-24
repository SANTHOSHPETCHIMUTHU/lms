from sqlalchemy import Column, Integer, ForeignKey, String, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(255))
    entity_type = Column(String(100))
    entity_id = Column(Integer)
    timestamp = Column(TIMESTAMP, server_default=func.now())
    ip_address = Column(String(50))