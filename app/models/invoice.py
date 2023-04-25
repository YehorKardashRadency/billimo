from sqlalchemy import Enum
from app.database import Column, Model, SurrogatePK, db, reference_col
from app.models.enums import ApprovalStatus
from app.models.enums import InvoiceType
from app.models.enums import Role


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
    buyer = db.relationship("Company", back_populates="invoices_as_buyer", foreign_keys=[buyer_id])

    seller_id = reference_col("companies")
    seller = db.relationship("Company", back_populates="invoices_as_seller", foreign_keys=[seller_id])

    type = Column(Enum(InvoiceType), nullable=False)
    approval_status = Column(Enum(ApprovalStatus), nullable=False)
    payment_status = Column(db.String, nullable=False)

    items = db.relationship("InvoiceItem", back_populates="invoice")
    
    bill = db.relationship("Bill", uselist=False, back_populates="invoice")
