from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.kyc import KYCRecord
from app.models.customer import Customer
from app.models.application import LoanApplication
from app.schemas.kyc import (
    PANRequest, AadhaarRequest,
    VideoKYCRequest, CreditCheckRequest,
    FinalKYCRequest
)

router = APIRouter(prefix="/kyc", tags=["KYC"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_or_create_kyc(db: Session, customer_id: int):
    kyc = db.query(KYCRecord).filter(KYCRecord.customer_id == customer_id).first()
    if not kyc:
        kyc = KYCRecord(customer_id=customer_id)
        db.add(kyc)
        db.commit()
        db.refresh(kyc)
    return kyc

@router.post("/pan")
def verify_pan(data: PANRequest, db: Session = Depends(get_db)):

    customer = db.query(Customer).filter(Customer.id == data.customer_id).first()
    if not customer:
        raise HTTPException(404, "Customer not found")

    kyc = get_or_create_kyc(db, data.customer_id)

    # mock PAN validation
    if len(data.pan_number) != 10:
        raise HTTPException(400, "Invalid PAN")

    kyc.pan_number = data.pan_number
    kyc.pan_verified = True
    db.commit()

    return {"message": "PAN verified"}

@router.post("/aadhaar")
def verify_aadhaar(data: AadhaarRequest, db: Session = Depends(get_db)):

    kyc = get_or_create_kyc(db, data.customer_id)

    if len(data.aadhaar_number) != 12:
        raise HTTPException(400, "Invalid Aadhaar")

    kyc.aadhaar_number = data.aadhaar_number
    kyc.aadhaar_verified = True
    db.commit()

    return {"message": "Aadhaar verified"}

@router.post("/video")
def video_kyc(data: VideoKYCRequest, db: Session = Depends(get_db)):

    kyc = get_or_create_kyc(db, data.customer_id)

    kyc.video_kyc_status = data.status
    db.commit()

    return {"message": "Video KYC updated"}

@router.post("/credit")
def credit_check(data: CreditCheckRequest, db: Session = Depends(get_db)):

    kyc = get_or_create_kyc(db, data.customer_id)

    kyc.cibil_score = data.cibil_score
    kyc.cibil_checked = True
    db.commit()

    return {"message": "Credit score saved"}

@router.post("/complete")
def complete_kyc(data: FinalKYCRequest, db: Session = Depends(get_db)):

    kyc = db.query(KYCRecord).filter(KYCRecord.customer_id == data.customer_id).first()
    if not kyc:
        raise HTTPException(400, "KYC not started")

    if not (kyc.pan_verified and kyc.aadhaar_verified and kyc.video_kyc_status == "COMPLETED"):
        raise HTTPException(400, "KYC incomplete")

    # update application status
    app = db.query(LoanApplication).filter(
        LoanApplication.customer_id == data.customer_id
    ).first()

    if app:
        app.status = "READY_FOR_REVIEW"

    customer = db.query(Customer).filter(Customer.id == data.customer_id).first()
    if customer:
        customer.status = "KYC_DONE"

    db.commit()

    return {"message": "KYC completed successfully"}