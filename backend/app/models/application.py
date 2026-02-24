from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

class LoanApplication(Base):
    __tablename__ = "loan_applications"
    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    application_number = Column(String(50), unique=True)
    loan_type = Column(String(50))
    requested_amount = Column(DECIMAL(14,2))
    tenure_months = Column(Integer)
    interest_rate_expected = Column(DECIMAL(5,2))
    status = Column(String(50), default="DRAFT")
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())