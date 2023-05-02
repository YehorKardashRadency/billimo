import attr
from sqlalchemy import func

from app.api.invoices.models import Invoice
from app.api.invoices.models import InvoiceNumberMapper
from app.core.port import UseCaseRequest, UseCaseResponse
from app.core.use_case import UseCase
from app.infra.db.extensions import db


@attr.s(auto_attribs=True)
class GetLastInvoiceNumberRequest(UseCaseRequest):
    pass


@attr.s(auto_attribs=True)
class GetLastInvoiceNumberResponse(UseCaseResponse):
    result: int = None


class GetLastInvoiceNumberUseCase(UseCase):
    def execute(self, uc_request: GetLastInvoiceNumberRequest) -> GetLastInvoiceNumberResponse:
        response = GetLastInvoiceNumberResponse()
        max_number = db.session.query(func.max(Invoice.number)).scalar()+1 or 1
        response.result = InvoiceNumberMapper.to_dto(max_number)
        return response
