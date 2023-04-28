from sqlalchemy import Enum

from app.api.bills.models.bill_status import BillStatus
from app.api.shared.models.approval_status import ApprovalStatus
from app.infra.db import Column, Model, SurrogatePK, db, reference_col


class Bill(Model, SurrogatePK):
    __tablename__ = 'bills'

    invoice_id = reference_col('invoices')
    invoice = db.relationship('Invoice', foreign_keys=[invoice_id], back_populates='bill')
    payment_method_id = Column(db.BigInteger, nullable=False)
    status = Column(Enum(BillStatus), nullable=False)
    approval_status = Column(Enum(ApprovalStatus), nullable=False)
    bill_cancellation_id = reference_col('bill_cancellations', nullable=True)
    bill_cancellation = db.relationship('BillCancellation', uselist=False, back_populates='bill')

    def __init__(self, invoice_id, payment_method_id=0,
                 status=BillStatus.Unpaid,
                 approval_status=ApprovalStatus.NotSet, bill_cancellation_id: int = None):
        self.invoice_id = invoice_id
        self.payment_method_id = payment_method_id
        self.status = status
        self.approval_status = approval_status
        self.bill_cancellation_id = bill_cancellation_id
