import attr
from sqlalchemy import and_
from sqlalchemy.orm import joinedload

from app.api.bills.models import Bill
from app.api.invoices.models import Invoice, InvoiceType
from app.api.shared.models import ApprovalStatus
from app.common import get_current_user
from app.core.port import UseCaseRequest, UseCaseResponse
from app.core.use_case import UseCase
from app.infra.db.extensions import db
from ..models import QuickActionsDTO


@attr.s(auto_attribs=True)
class GetQuickActionsRequest(UseCaseRequest):
    pass

@attr.s(auto_attribs=True)
class GetQuickActionsResponse(UseCaseResponse):
    result: QuickActionsDTO = None


class GetQuickActionsUseCase(UseCase):
    def execute(self, uc_request: GetQuickActionsRequest) -> GetQuickActionsResponse:
        response = GetQuickActionsResponse()
        current_user = get_current_user()
        company_id = current_user.company_id
        current_invoices = db.session.query(Invoice).where(
            and_(
                Invoice.type == InvoiceType.Current,
                Invoice.seller_id == company_id
            )
        ).count()
        approved_invoices = db.session.query(Invoice).where(
            and_(
                Invoice.approval_status == ApprovalStatus.Pending,
                Invoice.seller_id == company_id
            )
        ).count()
        approved_bills = db.session.query(Bill).options(joinedload(Bill.invoice)).where(
            and_(
                Bill.approval_status == ApprovalStatus.Pending,
                Bill.invoice.has(buyer_id=company_id)
            )
        ).count()
        paid_bills = db.session.query(Bill).options(joinedload(Bill.invoice)).where(
            and_(
                Bill.approval_status == ApprovalStatus.Pending,
                Bill.invoice.has(buyer_id=company_id)
            )
        ).count()
        response.result = QuickActionsDTO(
            approveBills=approved_bills,
            payBills=paid_bills,
            currentInvoices=current_invoices,
            approveInvoices=approved_invoices
        )
        return response
