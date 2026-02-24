from pydantic import BaseModel

class ApprovalInput(BaseModel):
    interest_rate: float
    tenure_months: int
    emi_amount: float