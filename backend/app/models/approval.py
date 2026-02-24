from sqlalchemy import Column, Integer, String, ForeignKey, Float, Boolean, DateTime
from datetime import datetime
from app.core.database import Base

class LoanApproval(Base):
    __tablename__ = "loan_approvals"

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("loan_applications.id"), unique=True)

    interest_rate = Column(Float)
    tenure_months = Column(Integer)
    emi_amount = Column(Float)

    sanction_generated = Column(Boolean, default=False)

    sms_sent = Column(Boolean, default=False)
    email_sent = Column(Boolean, default=False)
    app_notification_sent = Column(Boolean, default=False)

    esign_status = Column(String(50), default="PENDING")   # PENDING / INITIATED / SIGNED

    created_at = Column(DateTime, default=datetime.utcnow)