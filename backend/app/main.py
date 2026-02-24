from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app import models
from app.models.payment import Payment
from app.routes import auth, onboarding, kyc, document, credit, approval, disbursement, servicing, recovery

# create app FIRST
app = FastAPI(title="CubeLoan360 Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; refine for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# register routers AFTER app exists
app.include_router(auth.router)
app.include_router(onboarding.router)
app.include_router(kyc.router)
app.include_router(document.router)
app.include_router(credit.router)
app.include_router(approval.router)
app.include_router(disbursement.router)
app.include_router(servicing.router)
app.include_router(recovery.router)

# create tables (dev only)
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "CubeLoan360 backend running"}