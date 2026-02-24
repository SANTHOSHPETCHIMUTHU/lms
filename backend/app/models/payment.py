from sqlalchemy import Column, Integer, ForeignKey, Float, String, Date
from sqlalchemy.orm import relationship
from app.core.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    loan_account_id = Column(Integer, ForeignKey("loan_accounts.id"))
    amount = Column(Float)
    payment_date = Column(Date)
    mode = Column(String(50))   # UPI / Auto-Debit / NetBanking
    status = Column(String(20)) # SUCCESS / FAILED

    loan_account = relationship("LoanAccount")