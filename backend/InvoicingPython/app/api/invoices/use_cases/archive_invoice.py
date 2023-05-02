import attr

from app.api.invoices.models import Invoice, InvoiceType
from app.api.invoices.models.dto.invoice_dto import InvoiceDTO
from app.core.exceptions import BaseNotFoundException
from app.core.port import UseCaseRequest, UseCaseResponse
from app.core.use_case import UseCase
from app.infra.db.extensions import db


@attr.s(auto_attribs=True)
class ArchiveInvoiceRequest(UseCaseRequest):
    invoice_id: int


@attr.s(auto_attribs=True)
class ArchiveInvoiceResponse(UseCaseResponse):
    result: InvoiceDTO = None


class ArchiveInvoiceUseCase(UseCase):
    def execute(self, uc_request: ArchiveInvoiceRequest) -> ArchiveInvoiceResponse:
        response = ArchiveInvoiceResponse()
        invoice: Invoice = db.session.query(Invoice).get(uc_request.invoice_id)
        if invoice is None:
            response.error = BaseNotFoundException("Invoice not found")
            return response
        invoice.type = InvoiceType.Archived
        db.session.commit()
        return response
