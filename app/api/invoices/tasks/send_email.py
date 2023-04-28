from decimal import Decimal

import attr

from app.infra.celery import BaseEvent, Queues, celery, MessageTypes, publish


@attr.s(auto_attribs=True)
class BillEmailEvent(BaseEvent):
    billId: int
    companySenderId: int
    companySenderName: str
    companyReceiverEmail: str
    total: Decimal
    currency: int


@celery.task(name='send_bill_email')
def send_bill_email(event: BillEmailEvent):
    publish(Queues.bill_email_queue, MessageTypes.BILL_EMAIL, event)
