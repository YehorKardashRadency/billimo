from decimal import Decimal

import attr

from app.infra.celery import BaseEvent, celery, MessageTypes, publish
from app.infra.celery.exchanges import Exchanges


@attr.s(auto_attribs=True)
class BillNotificationEvent(BaseEvent):
    companySenderId: int
    companyReceiverId: int
    total: Decimal
    currency: int


@celery.task(name='send_bill_notification')
def send_bill_notification(event: BillNotificationEvent):
    publish(Exchanges.BILL_NOTIFICATION_EXCHANGE, MessageTypes.BILL_NOTIFICATION, event)
