from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.approval import LoanApproval
from app.models.application import LoanApplication
from app.schemas.approval import ApprovalInput

router = APIRouter(prefix="/approval", tags=["Loan Approval"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/generate/{application_id}")
def generate(application_id: int, data: ApprovalInput, db: Session = Depends(get_db)):

    app = db.query(LoanApplication).filter(
        LoanApplication.id == application_id
    ).first()

    if not app:
        raise HTTPException(404, "Application not found")

    approval = db.query(LoanApproval).filter(
        LoanApproval.application_id == application_id
    ).first()

    if not approval:
        approval = LoanApproval(application_id=application_id)

    approval.interest_rate = data.interest_rate
    approval.tenure_months = data.tenure_months
    approval.emi_amount = data.emi_amount
    approval.sanction_generated = True

    app.status = "SANCTIONED"

    db.add(approval)
    db.commit()
    db.refresh(approval)

    return {"message": "Sanction letter generated"}

@router.post("/notify/{application_id}")
def notify(application_id: int, db: Session = Depends(get_db)):

    approval = db.query(LoanApproval).filter(
        LoanApproval.application_id == application_id
    ).first()

    if not approval:
        raise HTTPException(404, "Approval not found")

    approval.sms_sent = True
    approval.email_sent = True
    approval.app_notification_sent = True

    db.commit()

    return {"message": "Notifications sent"}

@router.post("/esign/{application_id}")
def esign(application_id: int, db: Session = Depends(get_db)):

    approval = db.query(LoanApproval).filter(
        LoanApproval.application_id == application_id
    ).first()

    if not approval:
        raise HTTPException(404, "Approval not found")

    approval.esign_status = "INITIATED"
    db.commit()

    return {"message": "eSign initiated"}

@router.get("/summary/{application_id}")
def summary(application_id: int, db: Session = Depends(get_db)):

    approval = db.query(LoanApproval).filter(
        LoanApproval.application_id == application_id
    ).first()

    if not approval:
        raise HTTPException(404, "No approval data")

    return approval.__dict__