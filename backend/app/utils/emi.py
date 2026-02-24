from datetime import date
from dateutil.relativedelta import relativedelta

def generate_schedule(P, annual_rate, months, emi, start_date):
    r = annual_rate/12/100
    balance = P
    schedule = []

    for i in range(1, months+1):
        interest = balance * r
        principal = emi - interest
        balance -= principal
        if balance < 0:
            balance = 0

        schedule.append({
            "installment_no": i,
            "due_date": start_date + relativedelta(months=i),
            "emi": round(emi,2),
            "principal": round(principal,2),
            "interest": round(interest,2),
            "balance": round(balance,2)
        })

    return schedule