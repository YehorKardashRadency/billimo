from sqlalchemy import Enum

from app.database import Column, Model, SurrogatePK, db, reference_col
from app.models.role import Role


class Invoice(Model, SurrogatePK):
    __tablename__ = "invoices"

    number = Column(db.BigInteger, nullable=False)
    created_date = Column(db.DateTime, nullable=False)
    due_date = Column(db.DateTime, nullable=False)
    notes = Column(db.String)
    total = Column(db.BigInteger, nullable=False)
    is_regular = Column(db.Boolean, nullable=False)
    regular_invoice_date = Column(db.DateTime)
    template_preview = Column(db.LargeBinary)

    currency = Column(Enum(Role))

    buyer_id = reference_col("companies")
    buyer = db.relationship('Company', foreign_keys=[buyer_id], back_populates='invoices_as_buyer')

    seller_id = reference_col("companies", nullable=False)
    seller = db.relationship('Company', foreign_keys=[seller_id], back_populates='invoices_as_seller')

    type = Column(db.String, nullable=False)
    approval_status = Column(db.String, nullable=False)
    payment_status = Column(db.String, nullable=False)

    items = db.relationship("InvoiceItem", back_populates="invoice")
