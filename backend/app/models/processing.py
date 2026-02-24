from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class ProcessingProgress(Base):
    __tablename__ = "processing_progress"

    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    stage = Column(String(100))
    progress_percent = Column(Integer, default=0)