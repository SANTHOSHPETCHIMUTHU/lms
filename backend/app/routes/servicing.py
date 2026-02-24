from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.models.disbursement import LoanAccount, EMISchedule
from app.models.payment import Payment

router = APIRouter(prefix="/servicing", tags=["Loan Servicing"])

# ------------------------------
# DASHBOARD DATA
# ------------------------------
@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):

    # active loans (only ACTIVE ones)
    active_loans = db.query(LoanAccount).filter(
        LoanAccount.status == "ACTIVE"
    ).count()

    # total outstanding = SUM(balance)
    total_outstanding = db.query(
        func.coalesce(func.sum(EMISchedule.balance), 0)
    ).scalar()

    # total collected amount
    total_collected = db.query(
        func.coalesce(func.sum(Payment.amount), 0)
    ).filter(
        Payment.status == "SUCCESS"
    ).scalar()

    # total payable = collected + outstanding
    total_payable = total_collected + total_outstanding

    collection_rate = (
        (total_collected / total_payable) * 100
        if total_payable else 0
    )

    return {
        "active_loans": active_loans,
        "total_outstanding": float(total_outstanding),
        "collection_rate": round(collection_rate, 2)
    }


@router.get("/overdue-buckets")
def overdue_buckets(db: Session = Depends(get_db)):

    today = date.today()

    emis = db.query(EMISchedule).filter(
        EMISchedule.balance > 0,
        EMISchedule.due_date < today
    ).all()

    b1 = b2 = b3 = 0

    for e in emis:
        dpd = (today - e.due_date).days

        if dpd <= 30:
            b1 += float(e.balance)
        elif dpd <= 60:
            b2 += float(e.balance)
        else:
            b3 += float(e.balance)

    return {
        "dpd_1_30": b1,
        "dpd_31_60": b2,
        "dpd_60_plus": b3
    }

# ------------------------------
# EMI TIMELINE
# ------------------------------
@router.get("/timeline/{loan_account_id}")
def emi_timeline(loan_account_id: int, db: Session = Depends(get_db)):

    today = date.today()

    emis = db.query(EMISchedule).filter(
        EMISchedule.loan_account_id == loan_account_id
    ).all()

    timeline = []

    for e in emis:

        paid = db.query(Payment).filter(
            Payment.loan_account_id == loan_account_id,
            Payment.payment_date == e.due_date,
            Payment.status == "SUCCESS"
        ).first()

        if paid:
            status = "PAID"
        elif e.due_date < today:
            status = "OVERDUE"
        else:
            status = "UPCOMING"

        timeline.append({
            "installment": e.installment_no,
            "due_date": e.due_date,
            "emi": e.emi,
            "status": status
        })

    return timeline


# ------------------------------
# POST PAYMENT
# ------------------------------
@router.post("/pay/{loan_account_id}")
def post_payment(
    loan_account_id: int,
    amount: float,
    mode: str,
    db: Session = Depends(get_db)
):
    
    loan_account = db.query(LoanAccount).filter(
    LoanAccount.id == loan_account_id
).first()

    if not loan_account:
        return {"error": "Loan account not found"}


    # 1️⃣ save payment
    payment = Payment(
        loan_account_id=loan_account.id,
        amount=amount,
        payment_date=date.today(),
        mode=mode,
        status="SUCCESS"
    )
    db.add(payment)

    # 2️⃣ fetch pending EMIs oldest first
    pending = db.query(EMISchedule).filter(
        EMISchedule.loan_account_id == loan_account.id,
        EMISchedule.balance > 0
    ).order_by(EMISchedule.installment_no).all()

    remaining = amount

    # 3️⃣ allocate payment across EMIs
    for emi in pending:
        if remaining <= 0:
            break

        due = float(emi.principal + emi.interest)

        if remaining >= due:
            # fully paid
            remaining -= due
            emi.principal = 0
            emi.interest = 0
            emi.balance = 0
        else:
            # partially paid
            emi.balance = float(emi.balance) - remaining
            remaining = 0

    # 4️⃣ commit everything together
    db.commit()

    return {
        "message": "Payment posted",
        "allocated": amount - remaining,
        "excess": remaining
    }

@router.get("/recent-payments/{loan_account_id}")
def recent_payments(loan_account_id: int, db: Session = Depends(get_db)):

    payments = db.query(Payment).filter(
        Payment.loan_account_id == loan_account_id
    ).order_by(Payment.id.desc()).limit(10).all()

    return [
        {
            "id": p.id,
            "amount": p.amount,
            "date": p.payment_date,
            "mode": p.mode,
            "status": p.status
        }
        for p in payments
    ]