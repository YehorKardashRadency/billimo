from datetime import datetime
from typing import Any

import attr
from sqlalchemy.orm import joinedload

from app.api.invoices.models import Invoice
from app.api.invoices.models.invoice import NewInvoiceMapper, InvoiceItemMapper
from app.api.shared.models import ApprovalStatus
from app.common.current_user_middleware import get_current_user, Role
from app.common.external_api.administration_api import AdministrationApi
from app.core.exceptions import BaseNotFoundException
from app.core.port import UseCaseRequest, UseCaseResponse
from app.core.use_case import UseCase
from app.infra.db import db
from ..models import InvoiceType


@attr.s(auto_attribs=True)
class CreateInvoiceResult:
    id: int
    approvalStatus: int


@attr.s(auto_attribs=True)
class CreateInvoiceRequest(UseCaseRequest):
    invoice: Any


@attr.s(auto_attribs=True)
class CreateInvoiceResponse(UseCaseResponse):
    result: CreateInvoiceResult = None


class CreateInvoiceUseCase(UseCase):
    def execute(self, uc_request: CreateInvoiceRequest) -> CreateInvoiceResponse:
        user = get_current_user()
        response = CreateInvoiceResponse()
        invoice_dto = NewInvoiceMapper.to_dto(uc_request.invoice)
        invoice: Invoice
        if invoice_dto.id is None:
            invoice = NewInvoiceMapper.to_entity(invoice_dto)
        else:
            invoice = db.session.query(Invoice).options(joinedload(Invoice.items)).get(invoice_dto.id)
            if invoice is None:
                response.error = BaseNotFoundException("Invoice not found")
                return response

        if invoice_dto.id is None:
            db.session.add(invoice)
        else:
            invoice.due_date = invoice_dto.dueDate
            invoice.created_date = datetime.utcnow()
            invoice.currency = invoice_dto.currency
            invoice.buyer_id = invoice_dto.buyerId
            invoice.notes = invoice_dto.notes
            invoice.items = [InvoiceItemMapper.to_entity(item) for item in invoice_dto.items]
            invoice.total = sum([item.subtotal for item in invoice_dto.items])
            invoice.buyer_email = invoice_dto.buyerEmail

        administration_api = AdministrationApi(user)
        approval_settings = administration_api.get_approval_settings()
        passes_threshold = approval_settings.onSendingAllInvoices is False and (
                approval_settings.onPayingInvoicesHigherThan is False
                or
                invoice.total < approval_settings.sendingInvoicesThreshold
        )
        has_rights = user.role is (Role.Admin or Role.Director)
        invoice.approval_status = ApprovalStatus.Approved if (
                    has_rights or passes_threshold) else ApprovalStatus.Pending

        is_not_template_already = invoice_dto.id is None or invoice.type != InvoiceType.Template
        if invoice_dto.isTemplate and is_not_template_already:
            template = NewInvoiceMapper.to_entity(invoice_dto)
            template.type = InvoiceType.Template
            db.session.add(template)

        db.session.commit()
        response.result = CreateInvoiceResult(id=invoice.id, approvalStatus=invoice.approval_status.value)
        return response
