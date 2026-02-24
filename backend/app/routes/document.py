from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.document import Document
from app.models.customer import Customer
from app.models.application import LoanApplication
from app.schemas.document import UploadDocumentRequest, VerifyDocumentRequest
from app.models.customer import EmploymentDetails
from app.models.document import Document
from app.models.processing import ProcessingProgress   # create model
from app.core.document_config import REQUIRED_DOCUMENTS

router = APIRouter(prefix="/documents", tags=["Documents"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload")
def upload_document(data: UploadDocumentRequest, db: Session = Depends(get_db)):

    customer = db.query(Customer).filter(Customer.id == data.customer_id).first()
    if not customer:
        raise HTTPException(404, "Customer not found")

    doc = Document(
        customer_id=data.customer_id,
        document_type=data.document_type,
        file_path=data.file_path,
        verified=False,
        processing_status="PENDING"
    )

    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {
        "message": "Document uploaded",
        "document_id": doc.id
    }

@router.post("/verify")
def verify_document(data: VerifyDocumentRequest, db: Session = Depends(get_db)):

    doc = db.query(Document).filter(Document.id == data.document_id).first()
    if not doc:
        raise HTTPException(404, "Document not found")

    doc.verified = data.verified
    doc.processing_status = data.processing_status

    db.commit()

    return {"message": "Document updated"}

@router.get("/check/{customer_id}")
def check_documents(customer_id: int, db: Session = Depends(get_db)):

    docs = db.query(Document).filter(Document.customer_id == customer_id).all()

    if not docs:
        return {"ready": False, "reason": "No documents uploaded"}

    all_verified = all(d.verified for d in docs)

    if not all_verified:
        return {"ready": False, "reason": "Documents pending verification"}

    # move application forward
    app = db.query(LoanApplication).filter(
        LoanApplication.customer_id == customer_id
    ).first()

    if app:
        app.status = "DOCUMENTS_VERIFIED"
        db.commit()

    return {"ready": True, "message": "Documents verified"}

@router.get("/summary/{customer_id}")
def document_summary(customer_id: int, db: Session = Depends(get_db)):

    employment = db.query(EmploymentDetails).filter(
        EmploymentDetails.customer_id == customer_id
    ).first()

    docs = db.query(Document).filter(
        Document.customer_id == customer_id
    ).all()

    doc_map = {d.document_type: d for d in docs}

    documents = []
    for doc_type in REQUIRED_DOCUMENTS:

        if doc_type in doc_map:
            d = doc_map[doc_type]
            status = (
                "VERIFIED" if d.verified else
                "PROCESSING" if d.processing_status == "PENDING"
                else "UPLOADED"
            )
        else:
            status = "MISSING"

        documents.append({
            "document_type": doc_type,
            "status": status,
            "file": doc_map.get(doc_type).file_path if doc_type in doc_map else None
        })

    progress = db.query(ProcessingProgress).filter(
        ProcessingProgress.customer_id == customer_id
    ).all()

    return {
        "documents": documents,
        "employment": employment.__dict__ if employment else None,
        "processing": [p.__dict__ for p in progress]
    }