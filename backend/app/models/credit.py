from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text, DECIMAL, Boolean, TIMESTAMP
from app.core.database import Base

class CreditReview(Base):
    __tablename__ = "credit_reviews"

    id = Column(Integer, primary_key=True)

    application_id = Column(Integer, ForeignKey("loan_applications.id"))

    cibil_score = Column(Integer)
    monthly_income = Column(DECIMAL(12,2))
    total_obligations = Column(DECIMAL(12,2))
    foir_percent = Column(DECIMAL(5,2))

    fraud_flag = Column(Boolean, default=False)
    risk_level = Column(String(50))

    remarks = Column(Text)
    decision = Column(String(50))

    reviewed_by = Column(Integer, nullable=True)
    reviewed_at = Column(TIMESTAMP, nullable=True)