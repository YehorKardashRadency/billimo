import attr
from sqlalchemy.orm import joinedload

from app.core.exceptions import BaseNotFoundException
from app.core.port import UseCaseRequest, UseCaseResponse
from app.core.use_case import UseCase
from app.infra.db.extensions import db
from ..models import Bill, BillStatus, BillCancellationMapper
from ..models.dto import CancelBillDTO


@attr.s(auto_attribs=True)
class CancelBillRequest(UseCaseRequest):
    cancel_bill_dto: CancelBillDTO


@attr.s(auto_attribs=True)
class CancelBillResponse(UseCaseResponse):
    pass


class CancelBillUseCase(UseCase):
    def execute(self, uc_request: CancelBillRequest) -> CancelBillResponse:
        response = CancelBillResponse()
        bill: Bill = db.session.query(Bill).options(joinedload(Bill.invoice)).get(uc_request.cancel_bill_dto.billId)
        if bill is None:
            response.error = BaseNotFoundException("Bill not found")
            return response
        bill.status = BillStatus.Cancelled
        bill_cancellation = BillCancellationMapper.to_entity(uc_request.cancel_bill_dto)
        bill.bill_cancellation = bill_cancellation
        db.session.commit()
        return response
