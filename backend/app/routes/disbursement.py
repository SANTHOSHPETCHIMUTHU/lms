from email.mime import application

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.utils.emi import generate_schedule
import random
from app.core.database import get_db;
from app.models.disbursement import LoanAccount, Disbursement, EMISchedule
from app.models.approval import LoanApproval
from app.models.application import LoanApplication
from app.utils.emi import generate_schedule

router = APIRouter(prefix="/disbursement", tags=["Disbursement"])


@router.post("/confirm/{application_id}")
def confirm(application_id: int, db: Session = Depends(get_db)):

    # ✅ fetch application
    application = db.query(LoanApplication).filter(
        LoanApplication.id == application_id
    ).first()

    if not application:
        return {"error": "Application not found"}

    if application.requested_amount is None:
        return {"error": "Requested amount missing in application"}

    # ✅ fetch approval (YOU NEED THIS for rate/tenure/emi)
    approval = db.query(LoanApproval).filter(
        LoanApproval.application_id == application_id
    ).first()

    if not approval:
        return {"error": "Approval not found"}

    # check if loan already disbursed
    existing_account = db.query(LoanAccount).filter(
        LoanAccount.application_id == application_id
    ).first()

    if existing_account:
        return {
            "message": "Loan already disbursed",
            "account_number": existing_account.account_number
        }
    # ✅ generate loan account number
    account_no = "LN" + str(random.randint(100000, 999999))

    # ✅ create loan account (amount comes from application, terms from approval)
    loan_account = LoanAccount(
        application_id=application_id,
        account_number=account_no,
        loan_amount=application.requested_amount,
        principal_amount=application.requested_amount,
        interest_rate=approval.interest_rate,
        tenure_months=approval.tenure_months,
        emi_amount=approval.emi_amount
    )

    db.add(loan_account)
    db.commit()
    db.refresh(loan_account)

    # ✅ record disbursement
    disb = Disbursement(
        loan_account_id=loan_account.id,
        amount=application.requested_amount,
        disbursement_date=date.today()
    )
    db.add(disb)

    # ✅ generate EMI schedule
    amount = float(application.requested_amount)

    schedule = generate_schedule(
        amount,   # DECIMAL → float
        approval.interest_rate,
        approval.tenure_months,
        approval.emi_amount,
        date.today()
    )

    for row in schedule:
        db.add(EMISchedule(
            loan_account_id=loan_account.id,
            **row
        ))

    db.commit()

    return {
        "account_number": account_no,
        "schedule_count": len(schedule)
    }