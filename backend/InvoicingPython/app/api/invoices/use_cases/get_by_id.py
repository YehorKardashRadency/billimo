import attr

from app.api.invoices.models import Invoice
from app.api.invoices.models import InvoiceMapper
from app.api.invoices.models.dto.invoice_dto import InvoiceDTO
from app.core.exceptions import BaseNotFoundException
from app.core.port import UseCaseRequest, UseCaseResponse
from app.core.use_case import UseCase
from app.infra.db.extensions import db


@attr.s(auto_attribs=True)
class GetInvoiceByIdRequest(UseCaseRequest):
    invoice_id: int


@attr.s(auto_attribs=True)
class GetInvoiceByIdResponse(UseCaseResponse):
    result: InvoiceDTO = None


class GetInvoiceByIdUseCase(UseCase):
    def execute(self, uc_request: GetInvoiceByIdRequest) -> GetInvoiceByIdResponse:
        response = GetInvoiceByIdResponse()
        invoice: Invoice = db.session.query(Invoice).get(uc_request.invoice_id)
        if invoice is None:
            response.error = BaseNotFoundException("Invoice not found")
            return response
        dto = InvoiceMapper.to_dto(invoice)
        response.result = dto
        return response
