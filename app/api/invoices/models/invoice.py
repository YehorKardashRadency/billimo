import decimal
from datetime import datetime
from typing import List

from sqlalchemy import Enum
from app.infra.db import Column, Model, SurrogatePK, db, reference_col
from .currency import Currency
from .invoice_item import InvoiceItem
from .invoice_type import InvoiceType
from app.api.shared.models import ApprovalStatus


class Invoice(Model, SurrogatePK):
    __tablename__ = 'invoices'

    number = Column(db.BigInteger, nullable=False)
    created_date = Column(db.DateTime, nullable=False)
    due_date = Column(db.DateTime, nullable=False)
    notes = Column(db.String)
    total = Column(db.Numeric(precision=10, scale=2), nullable=False)
    is_regular = Column(db.Boolean, nullable=False)
    regular_invoice_date = Column(db.DateTime)
    template_preview = Column(db.LargeBinary)

    currency = Column(Enum(Currency))

    buyer_id = reference_col('companies')
    buyer = db.relationship('Company', back_populates='invoices_as_buyer', foreign_keys=[buyer_id])

    seller_id = reference_col('companies')
    seller = db.relationship('Company', back_populates='invoices_as_seller', foreign_keys=[seller_id])

    type = Column(Enum(InvoiceType), nullable=False)
    approval_status = Column(Enum(ApprovalStatus), nullable=False)

    items = db.relationship('InvoiceItem', back_populates='invoice', cascade='all, delete-orphan')

    bill = db.relationship('Bill', uselist=False, back_populates='invoice')

    def __init__(self, number: int, due_date: datetime, currency: Currency, notes: str = '',
                 invoice_type: InvoiceType = InvoiceType.Current, items: List[InvoiceItem] = None,
                 seller_id: int = None, buyer_id: int = None, total: decimal = 0,
                 regular_invoice_date: datetime = None, is_regular: bool = False):
        self.number = number
        self.created_date = datetime.utcnow()
        self.due_date = due_date
        self.currency = currency
        self.notes = notes
        self.type = invoice_type
        self.items = items or []
        self.seller_id = seller_id
        self.buyer_id = buyer_id
        self.total = total
        self.regular_invoice_date = regular_invoice_date
        self.is_regular = is_regular
        self.approval_status = ApprovalStatus.NotSet
