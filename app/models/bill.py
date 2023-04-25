from sqlalchemy import Enum
from app.database import Column, Model, SurrogatePK, db, reference_col
from app.models.enums import ApprovalStatus
from app.models.enums import BillStatus


class Bill(Model, SurrogatePK):
    __tablename__ = "bills"

    invoice_id = reference_col('invoices')
    invoice = db.relationship('Invoice', foreign_keys=[invoice_id], back_populates='bill')
    payment_method_id = Column(db.BigInteger, nullable=False)
    status = Column(Enum(BillStatus), nullable=False)
    approval_status = Column(Enum(ApprovalStatus), nullable=False)
    bill_cancellation_id = reference_col('bill_cancellations', nullable=True)
    bill_cancellation = db.relationship('BillCancellation', uselist=False, back_populates='bill')
