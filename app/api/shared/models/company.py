from app.infra.db import Column, Model, SurrogatePK, db
# from app.api.invoices.models.invoice import Invoice


class Company(Model, SurrogatePK):
    __tablename__ = 'companies'

    name = Column(db.String)
    ref_id = db.Column(db.BigInteger)

    invoices_as_buyer = db.relationship('Invoice', back_populates='buyer',
                                        foreign_keys='Invoice.buyer_id')
    invoices_as_seller = db.relationship('Invoice', back_populates='seller',
                                         foreign_keys='Invoice.seller_id')

    bill_cancellations = db.relationship('BillCancellation', back_populates='company')

    def __init__(self,name,ref_id):
        self.name = name
        self.ref_id = ref_id