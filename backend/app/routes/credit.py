from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.credit import CreditReview
from app.schemas.credit import CreditInput, CreditDecision

router = APIRouter(prefix="/credit", tags=["Credit Review"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/analyze/{application_id}")
def analyze(application_id: int, data: CreditInput, db: Session = Depends(get_db)):

    foir = (data.existing_obligations / data.monthly_income) * 100

    review = db.query(CreditReview).filter(
        CreditReview.application_id == application_id
    ).first()

    if not review:
        review = CreditReview(application_id=application_id)

    review.cibil_score = data.cibil_score
    review.monthly_income = data.monthly_income
    review.total_obligations = data.existing_obligations
    review.foir_percent = foir

    db.add(review)
    db.commit()
    db.refresh(review)

    return {"foir": foir}

@router.post("/decision/{application_id}")
def decision(application_id: int, data: CreditDecision, db: Session = Depends(get_db)):

    review = db.query(CreditReview).filter(
        CreditReview.application_id == application_id
    ).first()

    if not review:
        raise HTTPException(404, "Credit review not found")

    review.risk_level = data.risk_grade
    review.decision = data.decision
    review.remarks = data.remarks

    db.commit()

    return {"message": "Decision saved"}

@router.get("/summary/{application_id}")
def summary(application_id: int, db: Session = Depends(get_db)):

    review = db.query(CreditReview).filter(
        CreditReview.application_id == application_id
    ).first()

    if not review:
        raise HTTPException(404, "No credit data")

    return review.__dict__