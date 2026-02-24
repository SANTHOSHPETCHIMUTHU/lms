from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, DECIMAL, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True)
    first_name = Column(String(80))
    last_name = Column(String(80))
    dob = Column(Date)
    gender = Column(String(20))
    mobile_number = Column(String(20), unique=True)
    email = Column(String(120))
    otp_verified = Column(Boolean, default=False)
    status = Column(String(50), default="ONBOARDING")
    created_at = Column(TIMESTAMP, server_default=func.now())


class CustomerAddress(Base):
    __tablename__ = "customer_addresses"
    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    street_address = Column(String(255))
    city = Column(String(80))
    state = Column(String(80))
    pin_code = Column(String(15))


class EmploymentDetails(Base):
    __tablename__ = "employment_details"
    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    employment_type = Column(String(50))
    company_name = Column(String(120))
    designation = Column(String(120))
    monthly_income = Column(DECIMAL(12,2))
    experience_years = Column(Integer)