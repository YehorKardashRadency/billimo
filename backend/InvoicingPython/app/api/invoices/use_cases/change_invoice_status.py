import attr

from app.api.invoices.models import Invoice
from app.api.shared.models import ApprovalStatus
from app.common.current_user_middleware import Role, get_current_user
from app.core.exceptions import BaseForbiddenAccessException, BaseNotFoundException
from app.core.port import UseCaseRequest, UseCaseResponse
from app.core.use_case import UseCase
from app.infra.db import db


@attr.s(auto_attribs=True)
class ChangeApprovalStatusRequest(UseCaseRequest):
    invoice_id: int
    approval_status: ApprovalStatus


@attr.s(auto_attribs=True)
class ChangeApprovalStatusResponse(UseCaseResponse):
    pass


class ChangeApprovalStatusUseCase(UseCase):
    def execute(self, uc_request: ChangeApprovalStatusRequest) -> ChangeApprovalStatusResponse:
        user = get_current_user()
        response = ChangeApprovalStatusResponse()
        if user.role is not (Role.Admin or Role.Director):
            response.error = BaseForbiddenAccessException()
            return response
        invoice: Invoice = db.session.query(Invoice).get(uc_request.invoice_id)
        if invoice is None:
            response.error = BaseNotFoundException("Invoice not found")
            return response
        invoice.approval_status = uc_request.approval_status
        db.session.commit()
        return response
