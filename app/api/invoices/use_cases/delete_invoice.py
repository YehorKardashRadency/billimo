import attr

from app.api.bills.models import Bill
from app.api.invoices.models import Invoice
from app.core.exceptions import BaseNotFoundException, BaseBadRequestException
from app.core.port import UseCaseRequest, UseCaseResponse
from app.core.use_case import UseCase
from app.infra.db.extensions import db


@attr.s(auto_attribs=True)
class DeleteInvoiceRequest(UseCaseRequest):
    invoice_id: int


@attr.s(auto_attribs=True)
class DeleteInvoiceResponse(UseCaseResponse):
    pass


class DeleteInvoiceUseCase(UseCase):
    def execute(self, uc_request: DeleteInvoiceRequest) -> DeleteInvoiceResponse:
        response = DeleteInvoiceResponse()
        invoice: Invoice = db.session.query(Invoice).get(uc_request.invoice_id)
        if invoice is None:
            response.error = BaseNotFoundException("Invoice not found")
            return response
        bill = db.session.query(Bill).filter(Bill.invoice_id == invoice.id).first()
        if bill is not None:
            response.error = BaseBadRequestException('You can\'t delete an invoice with an existing bill')
            return response
        db.session.delete(invoice)
        db.session.commit()
        return response
