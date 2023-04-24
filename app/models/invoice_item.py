from app.database import Column, Model, SurrogatePK, db, reference_col


class InvoiceItem(Model, SurrogatePK):
    __tablename__ = "invoice_items"

    description = Column(db.String, nullable=False)
    metric = Column(db.String, nullable=False)
    count = Column(db.Integer, nullable=False)
    price = Column(db.Numeric(precision=10, scale=2), nullable=False)
    subtotal = Column(db.Numeric(precision=10, scale=2), nullable=False)
    invoice_id = reference_col("invoices")
    invoice = db.relationship("Invoice", back_populates='items')
