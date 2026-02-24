from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, Date, String
from app.core.database import Base

class RepaymentSchedule(Base):
    __tablename__ = "repayment_schedules"
    id = Column(Integer, primary_key=True)
    loan_id = Column(Integer, ForeignKey("loans.id"))
    emi_number = Column(Integer)
    due_date = Column(Date)
    principal_component = Column(DECIMAL(12,2))
    interest_component = Column(DECIMAL(12,2))
    total_emi = Column(DECIMAL(12,2))
    balance_after = Column(DECIMAL(14,2))
    status = Column(String(50), default="PENDING")