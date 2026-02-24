from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

class KYCRecord(Base):
    __tablename__ = "kyc_records"
    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    pan_number = Column(String(20))
    pan_verified = Column(Boolean, default=False)
    aadhaar_number = Column(String(20))
    aadhaar_verified = Column(Boolean, default=False)
    video_kyc_status = Column(String(50))
    cibil_score = Column(Integer)
    cibil_checked = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())