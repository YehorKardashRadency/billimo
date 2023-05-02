import attr

from app.api.bills.models import Bill, BillStatus
from app.api.invoices.models import Invoice
from app.common.current_user_middleware import get_current_user, Role
from app.common.external_api.administration_api import AdministrationApi
from app.core.exceptions import BaseNotFoundException, BaseBadRequestException
from app.core.port import UseCaseRequest, UseCaseResponse
from app.core.use_case import UseCase
from app.infra.db.extensions import db
from ..models import InvoiceType
from ..tasks.send_email import send_bill_email, BillEmailEvent
from ..tasks.send_notification import send_bill_notification, BillNotificationEvent
from ..tasks.update_payment_statistic import update_payment_statistic, UpdatePaymentStatisticEvent
from ...shared.models import ApprovalStatus


@attr.s(auto_attribs=True)
class SendInvoiceRequest(UseCaseRequest):
    invoice_id: int


@attr.s(auto_attribs=True)
class SendInvoiceResponse(UseCaseResponse):
    pass


class SendInvoiceUseCase(UseCase):
    def execute(self, uc_request: SendInvoiceRequest) -> SendInvoiceResponse:
        response = SendInvoiceResponse()
        current_user = get_current_user()
        invoice: Invoice = db.session.query(Invoice).get(uc_request.invoice_id)

        if invoice is None:
            response.error = BaseNotFoundException('Invoice not found')
            return response
        if invoice.type == InvoiceType.Archived:
            response.error = BaseBadRequestException('You can\'t send invoice which status is Archived')
            return response
        if invoice.approval_status != ApprovalStatus.Approved \
                and current_user.role is not (Role.Admin or Role.Director):
            response.error = BaseBadRequestException('You can\'t send invoice which is not approved')
            return response
        bill = db.session.query(Bill).filter(Bill.invoice_id == invoice.id).first()
        if bill is not None:
            response.error = BaseBadRequestException('Bill already exists')
            return response

        bill = Bill(
            invoice_id=invoice.id,
            status=BillStatus.Unpaid,
            approval_status=ApprovalStatus.NotSet
        )
        db.session.add(bill)
        invoice.type = InvoiceType.Archived
        invoice.approval_status = ApprovalStatus.Approved
        db.session.commit()

        if invoice.buyer_id is None:
            administration_api = AdministrationApi(current_user)
            sender_details = administration_api.get_company_details(invoice.seller.ref_id)
            email = BillEmailEvent(
                billId=bill.id,
                companySenderId=sender_details.id,
                companySenderName=sender_details.name,
                companyReceiverEmail=invoice.buyer_email,
                total=invoice.total,
                currency=invoice.currency.value
            )
            send_bill_email.delay(email.__dict__)
        else:
            notification = BillNotificationEvent(
                companySenderId=invoice.seller_id,
                companyReceiverId=invoice.buyer_id,
                total=invoice.total,
                currency=invoice.currency.value
            )
            send_bill_notification.delay(notification.__dict__)

        update_statistic_event = UpdatePaymentStatisticEvent(
            sellerId=invoice.seller_id,
            buyerId=invoice.buyer_id,
            forPayment=invoice.total
        )
        update_payment_statistic.delay(update_statistic_event.__dict__)
        return response
