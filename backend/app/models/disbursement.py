from sqlalchemy import Column, Integer, ForeignKey, String, Float, Date
from sqlalchemy.orm import relationship
from app.core.database import Base


class LoanAccount(Base):
    __tablename__ = "loan_accounts"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("loan_applications.id"))
    account_number = Column(String(50), unique=True, index=True)

    loan_amount = Column(Float)
    principal_amount = Column(Float)
    interest_rate = Column(Float)
    tenure_months = Column(Integer)
    emi_amount = Column(Float)

    status = Column(String(20), default="ACTIVE")

    # ✅ THIS MUST EXIST (reverse side of relationship)
    disbursements = relationship("Disbursement", back_populates="loan_account")


class Disbursement(Base):
    __tablename__ = "disbursements"

    id = Column(Integer, primary_key=True, index=True)
    loan_account_id = Column(Integer, ForeignKey("loan_accounts.id"))
    amount = Column(Float)
    disbursement_date = Column(Date)

    # ✅ THIS references LoanAccount.disbursements
    loan_account = relationship("LoanAccount", back_populates="disbursements")


class EMISchedule(Base):
    __tablename__ = "emi_schedules"

    id = Column(Integer, primary_key=True, index=True)
    loan_account_id = Column(Integer, ForeignKey("loan_accounts.id"))

    installment_no = Column(Integer)
    due_date = Column(Date)
    emi = Column(Float)
    principal = Column(Float)
    interest = Column(Float)
    balance = Column(Float)