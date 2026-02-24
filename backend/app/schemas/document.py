from pydantic import BaseModel

class UploadDocumentRequest(BaseModel):
    customer_id: int
    document_type: str
    file_path: str   # for now frontend sends path or filename


class VerifyDocumentRequest(BaseModel):
    document_id: int
    verified: bool
    processing_status: str   # APPROVED / REJECTED / PENDING

class EmploymentUpdateRequest(BaseModel):
    customer_id: int
    company_name: str
    designation: str
    experience_years: int
    monthly_income: float
    employment_type: str