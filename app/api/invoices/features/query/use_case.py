import attr

from app.api.invoices.features.query.DTO import InvoiceDTO
from app.api.invoices.features.query.mapper import ListInvoicesPresenterMapper
from app.api.invoices.models import Invoice
from app.api.invoices.models.invoice_type import InvoiceType
from app.core.port import UseCaseRequest, UseCaseResponse, UseCaseOutputPort
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
    def execute(self, uc_request: ListInvoicesRequest,
                uc_output_port: UseCaseOutputPort[ListInvoicesResponse]) -> None:
        response = ListInvoicesResponse()
        invoices = db.session.execute(
            db
            .select(Invoice)
            .filter(Invoice.type == uc_request.invoice_type, Invoice.is_regular if uc_request.regular else True)
            .join(Invoice.items)
            .join(Invoice.buyer)
            .distinct()
        ).scalars().all()
        dto = list(map(ListInvoicesPresenterMapper.to_dto, invoices))
        response.result = dto
        # logic
        uc_output_port.handle(response)

