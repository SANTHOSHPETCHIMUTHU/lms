from sqlalchemy import Column, Integer, ForeignKey, String, Date, Float
from app.core.database import Base

class RecoveryAction(Base):
    __tablename__ = "recovery_actions"

    id = Column(Integer, primary_key=True, index=True)
    loan_account_id = Column(Integer, ForeignKey("loan_accounts.id"))
    action_date = Column(Date)
    action_type = Column(String(50))   # CALL / VISIT / LEGAL / NOTICE
    remarks = Column(String(255))
    officer = Column(String(100))