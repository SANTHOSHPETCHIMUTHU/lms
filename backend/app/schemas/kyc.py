from pydantic import BaseModel

class PANRequest(BaseModel):
    customer_id: int
    pan_number: str

class AadhaarRequest(BaseModel):
    customer_id: int
    aadhaar_number: str

class VideoKYCRequest(BaseModel):
    customer_id: int
    status: str   # COMPLETED / FAILED / PENDING

class CreditCheckRequest(BaseModel):
    customer_id: int
    cibil_score: int

class FinalKYCRequest(BaseModel):
    customer_id: int