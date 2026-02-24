from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import SessionLocal
from app.models.customer import Customer, CustomerAddress, EmploymentDetails
from app.models.application import LoanApplication
from app.schemas.onboarding import (
    BasicInfoRequest,
    ContactInfoRequest,
    DemographicsRequest,
    ConfirmRequest
)

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/customers")
def get_customers(db: Session = Depends(get_db)):
    customers = db.query(Customer).all()
    return customers

@router.get("/customers/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(404, "Customer not found")
    
    address = db.query(CustomerAddress).filter(CustomerAddress.customer_id == customer_id).first()
    employment = db.query(EmploymentDetails).filter(EmploymentDetails.customer_id == customer_id).first()
    application = db.query(LoanApplication).filter(LoanApplication.customer_id == customer_id).first()

    return {
        "customer": customer,
        "address": address,
        "employment": employment,
        "application": application
    }

@router.post("/basic")
def create_basic(data: BasicInfoRequest, db: Session = Depends(get_db)):

    customer = Customer(
        first_name=data.first_name,
        last_name=data.last_name,
        dob=data.dob,
        gender=data.gender,
        status="BASIC_DONE"
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return {
        "customer_id": customer.id,
        "message": "Basic info saved"
    }

@router.post("/contact")
def add_contact(data: ContactInfoRequest, db: Session = Depends(get_db)):

    customer = db.query(Customer).filter(Customer.id == data.customer_id).first()
    if not customer:
        raise HTTPException(404, "Customer not found")

    # mock OTP check
    if data.otp != "123456":
        raise HTTPException(400, "Invalid OTP")

    customer.mobile_number = data.mobile_number
    customer.email = data.email
    customer.otp_verified = True
    customer.status = "CONTACT_DONE"

    db.commit()

    return {"message": "Contact verified"}

@router.post("/demographics")
def add_demographics(data: DemographicsRequest, db: Session = Depends(get_db)):

    customer = db.query(Customer).filter(Customer.id == data.customer_id).first()
    if not customer:
        raise HTTPException(404, "Customer not found")

    address = CustomerAddress(
        customer_id=data.customer_id,
        street_address=data.street_address,
        city=data.city,
        state=data.state,
        pin_code=data.pin_code
    )

    employment = EmploymentDetails(
        customer_id=data.customer_id,
        employment_type=data.employment_type
    )

    customer.status = "DEMOGRAPHICS_DONE"

    db.add(address)
    db.add(employment)
    db.commit()

    return {"message": "Demographics saved"}

@router.post("/confirm")
def confirm(data: ConfirmRequest, db: Session = Depends(get_db)):

    customer = db.query(Customer).filter(Customer.id == data.customer_id).first()
    if not customer:
        raise HTTPException(404, "Customer not found")

    application_number = f"CL-{data.customer_id}-{int(datetime.utcnow().timestamp())}"

    app = LoanApplication(
        customer_id=data.customer_id,
        application_number=application_number,
        status="KYC_PENDING"
    )

    customer.status = "ONBOARDED"

    db.add(app)
    db.commit()
    db.refresh(app)

    return {
        "message": "Profile created successfully",
        "customer_id": customer.id,
        "application_number": app.application_number
    }