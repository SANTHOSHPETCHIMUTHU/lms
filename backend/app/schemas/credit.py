from pydantic import BaseModel
from typing import Optional

class CreditInput(BaseModel):
    cibil_score: int
    monthly_income: float
    existing_obligations: float

class CreditDecision(BaseModel):
    risk_grade: str
    decision: str
    remarks: Optional[str] = None