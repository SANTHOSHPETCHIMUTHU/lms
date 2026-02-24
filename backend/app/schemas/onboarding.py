from pydantic import BaseModel, EmailStr
from datetime import date

# STEP 1
class BasicInfoRequest(BaseModel):
    first_name: str
    last_name: str
    dob: date
    gender: str


# STEP 2
class ContactInfoRequest(BaseModel):
    customer_id: int
    mobile_number: str
    email: EmailStr
    otp: str


# STEP 3
class DemographicsRequest(BaseModel):
    customer_id: int
    street_address: str
    city: str
    state: str
    pin_code: str
    employment_type: str


# STEP 4
class ConfirmRequest(BaseModel):
    customer_id: int