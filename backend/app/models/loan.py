from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, Date
from app.core.database import Base

class Loan(Base):
    __tablename__ = "loans"
    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("loan_applications.id"))
    customer_id = Column(Integer, ForeignKey("customers.id"))
    loan_account_number = Column(String(50), unique=True)
    principal_amount = Column(DECIMAL(14,2))
    interest_rate = Column(DECIMAL(5,2))
    tenure_months = Column(Integer)
    emi_amount = Column(DECIMAL(12,2))
    start_date = Column(Date)
    end_date = Column(Date)
    loan_status = Column(String(50))