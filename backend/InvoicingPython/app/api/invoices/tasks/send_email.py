from decimal import Decimal

import attr

from app.infra.celery import BaseEvent, celery, MessageTypes, publish
from app.infra.celery.exchanges import Exchanges


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
    publish(Exchanges.BILL_EMAIL_EXCHANGE, MessageTypes.BILL_EMAIL, event)
