from decimal import Decimal

import attr

from app.infra.celery import BaseEvent, Queues, celery, MessageTypes, publish


@attr.s(auto_attribs=True)
class BillNotificationEvent(BaseEvent):
    companySenderId: int
    companyReceiverId: int
    total: Decimal
    currency: int


@celery.task(name='send_bill_notification')
def send_bill_notification(event: BillNotificationEvent):
    publish(Queues.bill_notification_queue, MessageTypes.BILL_NOTIFICATION, event)
