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
class ChangeBillStatusMultipleRequest(UseCaseRequest):
    bill_ids: list[int]
    approval_status: ApprovalStatus


@attr.s(auto_attribs=True)
class ChangeBillStatusMultipleResponse(UseCaseResponse):
    pass


class ChangeBillStatusMultipleUseCase(UseCase):
    def execute(self, uc_request: ChangeBillStatusMultipleRequest) -> ChangeBillStatusMultipleResponse:
        user = get_current_user()
        response = ChangeBillStatusMultipleResponse()
        for id in uc_request.bill_ids:
            bill: Bill = db.session.query(Bill).options(joinedload(Bill.invoice)).get(id)
            if bill is None:
                response.error = BaseNotFoundException("Bill not found")
                return response
            bill.approval_status = uc_request.approval_status
        db.session.commit()
        return response
