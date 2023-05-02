import attr
from sqlalchemy.orm import joinedload

from app.common import get_current_user
from app.common.external_api.administration_api import AdministrationApi
from app.core.exceptions import BaseNotFoundException
from app.core.port import UseCaseRequest, UseCaseResponse
from app.core.use_case import UseCase
from app.infra.db.extensions import db
from ..models import Bill, DetailedBillMapper
from ..models.dto import BillDTO


@attr.s(auto_attribs=True)
class GetBillByIdRequest(UseCaseRequest):
    bill_id: int
    include_companies: bool = True


@attr.s(auto_attribs=True)
class GetBillByIdResponse(UseCaseResponse):
    result: BillDTO = None


class GetBillByIdUseCase(UseCase):
    def execute(self, uc_request: GetBillByIdRequest) -> GetBillByIdResponse:
        response = GetBillByIdResponse()
        current_user = get_current_user()
        bill: Bill = db.session.query(Bill).options(joinedload(Bill.invoice)).get(uc_request.bill_id)
        if bill is None:
            response.error = BaseNotFoundException("Bill not found")
            return response
        dto = DetailedBillMapper().to_dto(bill)
        if uc_request.include_companies:
            administration_api = AdministrationApi(current_user)
            buyer = administration_api.get_company_details(bill.invoice.buyer_id)
            seller = administration_api.get_company_details(bill.invoice.seller_id)
            dto.buyer = buyer
            dto.seller = seller
        response.result = dto
        return response
