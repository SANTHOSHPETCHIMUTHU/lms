from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.models.disbursement import EMISchedule, LoanAccount
from app.models.recovery import RecoveryAction
from app.models.application import LoanApplication
from app.models.customer import Customer

router = APIRouter(prefix="/recovery", tags=["Recovery"])

@router.get("/overdue")
def overdue_loans(db: Session = Depends(get_db)):

    today = date.today()

    emis = db.query(EMISchedule).filter(
        EMISchedule.balance > 0,
        EMISchedule.due_date < today
    ).all()

    result = []

    for e in emis:

        dpd = (today - e.due_date).days

        if dpd <= 30:
            bucket = "DPD 1-30"
        elif dpd <= 60:
            bucket = "DPD 31-60"
        else:
            bucket = "DPD 60+"

        result.append({
            "loan_account_id": e.loan_account_id,
            "installment": e.installment_no,
            "due_date": e.due_date,
            "balance": e.balance,
            "dpd": dpd,
            "bucket": bucket
        })

    return result

@router.post("/action/{loan_account_id}")
def add_action(
    loan_account_id: int,
    action_type: str,
    remarks: str,
    officer: str,
    db: Session = Depends(get_db)
):

    action = RecoveryAction(
        loan_account_id=loan_account_id,
        action_date=date.today(),
        action_type=action_type,
        remarks=remarks,
        officer=officer
    )

    db.add(action)
    db.commit()

    return {"message": "Recovery action logged"}

@router.get("/history/{loan_account_id}")
def action_history(loan_account_id: int, db: Session = Depends(get_db)):

    actions = db.query(RecoveryAction).filter(
        RecoveryAction.loan_account_id == loan_account_id
    ).order_by(RecoveryAction.id.desc()).all()

    return [
        {
            "date": a.action_date,
            "type": a.action_type,
            "remarks": a.remarks,
            "officer": a.officer
        }
        for a in actions
    ]

@router.get("/board")
def recovery_board(db: Session = Depends(get_db)):

    today = date.today()

    # fetch all overdue EMIs
    emis = db.query(EMISchedule).filter(
        EMISchedule.balance > 0,
        EMISchedule.due_date < today
    ).all()

    results = []

    for e in emis:

        # get loan account
        loan = db.query(LoanAccount).filter(
            LoanAccount.id == e.loan_account_id
        ).first()

        if not loan:
            continue

        # get application
        app = db.query(LoanApplication).filter(
            LoanApplication.id == loan.application_id
        ).first()

        # get customer
        customer = db.query(Customer).filter(
            Customer.id == app.customer_id
        ).first() if app else None

        dpd = (today - e.due_date).days

        # bucket logic
        if dpd <= 30:
            bucket = "DPD 1-30"
        elif dpd <= 60:
            bucket = "DPD 31-60"
        else:
            bucket = "DPD 60+"

        # fake officer/status for now (safe default)
        officer = "Unassigned"
        status = "Pending"

        results.append({
            "loan_account_id": loan.id,
            "customer": customer.name if customer else "Unknown",
            "loan_id": loan.account_number,
            "installment": e.installment_no,
            "dpd": dpd,
            "overdue_amount": float(e.balance),
            "bucket": bucket,
            "officer": officer,
            "status": status
        })

    return results

@router.get("/board")
def recovery_board(db: Session = Depends(get_db)):

    today = date.today()

    # fetch all overdue EMIs
    emis = db.query(EMISchedule).filter(
        EMISchedule.balance > 0,
        EMISchedule.due_date < today
    ).all()

    results = []

    for e in emis:

        # get loan account
        loan = db.query(LoanAccount).filter(
            LoanAccount.id == e.loan_account_id
        ).first()

        if not loan:
            continue

        # get application
        app = db.query(LoanApplication).filter(
            LoanApplication.id == loan.application_id
        ).first()

        # get customer
        customer = db.query(Customer).filter(
            Customer.id == app.customer_id
        ).first() if app else None

        dpd = (today - e.due_date).days

        # bucket logic
        if dpd <= 30:
            bucket = "DPD 1-30"
        elif dpd <= 60:
            bucket = "DPD 31-60"
        else:
            bucket = "DPD 60+"

        # fake officer/status for now (safe default)
        officer = "Unassigned"
        status = "Pending"

        results.append({
            "loan_account_id": loan.id,
            "customer": customer.name if customer else "Unknown",
            "loan_id": loan.account_number,
            "installment": e.installment_no,
            "dpd": dpd,
            "overdue_amount": float(e.balance),
            "bucket": bucket,
            "officer": officer,
            "status": status
        })

    return results