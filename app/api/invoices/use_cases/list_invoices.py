import attr

from app.api.invoices.models import Invoice, InvoiceMapper
from app.api.invoices.models.dto.invoice_dto import InvoiceDTO
from app.api.invoices.models.invoice_type import InvoiceType
from app.core.port import UseCaseRequest, UseCaseResponse
from app.core.use_case import UseCase
from app.infra.db.extensions import db


@attr.s(auto_attribs=True)
class ListInvoicesRequest(UseCaseRequest):
    invoice_type: InvoiceType
    regular: bool = False


@attr.s(auto_attribs=True)
class ListInvoicesResponse(UseCaseResponse):
    result: list[InvoiceDTO] = None
    """ Extends UseCase Response """


class ListInvoicesUseCase(UseCase):
    def execute(self, uc_request: ListInvoicesRequest) -> ListInvoicesResponse:
        response = ListInvoicesResponse()
        invoices = db.session.execute(
            db
            .select(Invoice)
            .filter(Invoice.type == uc_request.invoice_type, Invoice.is_regular if uc_request.regular else True)
            .join(Invoice.items)
            .join(Invoice.buyer)
            .distinct()
        ).scalars().all()
        dto = list(map(InvoiceMapper.to_dto, invoices))
        response.result = dto
        return response
