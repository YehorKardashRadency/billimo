import attr

from app.api.invoices.models import Invoice, InvoiceMapper
from app.api.invoices.models.invoice_type import InvoiceType
from app.common import get_current_user
from app.common.external_api.administration_api import AdministrationApi
from app.core.port import UseCaseRequest, UseCaseResponse
from app.core.use_case import UseCase
from app.infra.db.extensions import db
from ..models.dto import InvoiceDTO, CompanyDTO


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
        current_user = get_current_user()
        invoices = db.session.execute(
            db
            .select(Invoice)
            .filter(Invoice.type == uc_request.invoice_type, Invoice.is_regular if uc_request.regular else True)
            .join(Invoice.items)
            .join(Invoice.buyer)
            .distinct()
        ).scalars().all()
        requested_companies = list(set([invoice.buyer.ref_id for invoice in invoices if invoice.buyer is not None]))
        administration_api = AdministrationApi(current_user)
        invoices_dto = list(map(InvoiceMapper.to_dto, invoices))
        companies = administration_api.get_companies(requested_companies)
        merged = []
        for invoice in invoices_dto:
            for company in companies:
                if invoice.buyerId == company.id:
                    invoice.company = CompanyDTO(
                        id=company.id,
                        name=company.name,
                        email=company.email,
                        logo=company.logo
                    )
                    break
            merged.append(invoice)
        response.result = merged
        return response
