import attr
from sqlalchemy.orm import joinedload

from app.api.shared.models import ApprovalStatus
from app.common.current_user_middleware import Role, get_current_user
from app.core.exceptions import BaseForbiddenAccessException, BaseNotFoundException
from app.core.port import UseCaseRequest, UseCaseResponse
from app.core.use_case import UseCase
from app.infra.db import db
from ..models import Bill

@attr.s(auto_attribs=True)
class ChangeBillStatusRequest(UseCaseRequest):
    bill_id: int
    approval_status: ApprovalStatus


@attr.s(auto_attribs=True)
class ChangeBillStatusResponse(UseCaseResponse):
    pass


class ChangeBillStatusUseCase(UseCase):
    def execute(self, uc_request: ChangeBillStatusRequest) -> ChangeBillStatusResponse:
        user = get_current_user()
        response = ChangeBillStatusResponse()
        if user.role is not (Role.Admin or Role.Director):
            response.error = BaseForbiddenAccessException()
            return response
        bill: Bill = db.session.query(Bill).options(joinedload(Bill.invoice)).get(uc_request.bill_id)
        if bill is None:
            response.error = BaseNotFoundException("Bill not found")
            return response
        if bill.invoice.seller_id != user.company_id:
            response.error = BaseForbiddenAccessException()
            return response
        bill.approval_status = uc_request.approval_status
        db.session.commit()
        return response
