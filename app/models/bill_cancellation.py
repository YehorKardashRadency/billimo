from datetime import datetime
from app.database import Column, Model, SurrogatePK, db, reference_col


class BillCancellation(Model, SurrogatePK):
    __tablename__ = "bill_cancellations"

    bill = db.relationship("Bill", back_populates="bill_cancellation")
    company_id = reference_col("companies")
    company = db.relationship("Company", foreign_keys=[company_id], back_populates="bill_cancellations")
    cancellation_time = Column(db.DateTime, nullable=False, default=datetime.utcnow)
    reason = Column(db.String, nullable=False)
