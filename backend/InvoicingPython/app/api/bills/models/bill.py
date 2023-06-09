from sqlalchemy import Enum

from app.api.invoices.models import InvoiceMapper
from app.api.shared.models.approval_status import ApprovalStatus
from app.common.external_api.administration_api import CompanyInfo
from app.core.mapper import ApiMapper, Payload, Entity
from app.infra.db import Column, Model, SurrogatePK, db, reference_col
from .bill_status import BillStatus
from .dto import BillDTO, DetailedBillDTO


class Bill(Model, SurrogatePK):
    __tablename__ = 'bills'

    invoice_id = reference_col('invoices')
    invoice = db.relationship('Invoice', foreign_keys=[invoice_id], back_populates='bill')
    payment_method_id = Column(db.BigInteger, nullable=True)
    status = Column(Enum(BillStatus), nullable=False)
    approval_status = Column(Enum(ApprovalStatus), nullable=False)
    bill_cancellation = db.relationship('BillCancellation', uselist=False, back_populates='bill')

    def __init__(self, invoice_id, status=BillStatus.Unpaid,
                 approval_status=ApprovalStatus.NotSet):
        self.invoice_id = invoice_id
        self.status = status
        self.approval_status = approval_status


class BillMapper:
    companies: list[CompanyInfo]

    def __init__(self, companies: list[CompanyInfo] = None):
        if companies is None:
            companies = []
        self.companies = companies

    def to_dto(self, entity: Bill) -> BillDTO:
        bill_company = None
        for company in self.companies:
            if company.id == entity.invoice.buyer_id:
                bill_company = company
                break

        return BillDTO(
            id=entity.id,
            invoiceId=entity.invoice_id,
            invoiceNumber=entity.invoice.number,
            dueDate=entity.invoice.due_date,
            createdDate=entity.invoice.created_date,
            paymentMethod='',
            paymentMethodId=entity.payment_method_id,
            status=entity.status.name,
            companyName=bill_company.name if bill_company else '',
            companyLogo=bill_company.logo if bill_company else '',
            companyId=bill_company.id if bill_company else 0,
            amount=entity.invoice.total,
            currency=entity.invoice.currency.name,
        )


class DetailedBillMapper(ApiMapper):
    @staticmethod
    def to_entity(payload: Payload) -> Entity:
        raise NotImplemented

    @staticmethod
    def to_dto(entity: Bill) -> DetailedBillDTO:
        return DetailedBillDTO(
            id=entity.id,
            status=entity.status.name,
            approvalStatus=entity.approval_status.name,
            paymentMethodId=entity.payment_method_id,
            invoice=InvoiceMapper.to_dto(entity.invoice),
            buyer=None,
            seller=None
        )
