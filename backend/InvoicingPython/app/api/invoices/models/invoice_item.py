from sqlalchemy import Enum

from app.api.invoices.models.metric import Metric
from app.infra.db import Column, Model, SurrogatePK, db, reference_col


class InvoiceItem(Model, SurrogatePK):
    __tablename__ = 'invoice_items'

    description = Column(db.String, nullable=False)
    metric = Column(Enum(Metric), nullable=False)
    count = Column(db.Integer, nullable=False)
    price = Column(db.Numeric(precision=10, scale=2), nullable=False)
    subtotal = Column(db.Numeric(precision=10, scale=2), nullable=False)
    invoice_id = reference_col('invoices')
    invoice = db.relationship('Invoice', back_populates='items')

    def __init__(self, description, metric, count, price, subtotal):
        self.description = description
        self.metric = metric
        self.count = count
        self.price = price
        self.subtotal = subtotal
