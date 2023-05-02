from decimal import Decimal

import attr

from app.infra.celery import BaseEvent, celery, publish, MessageTypes
from app.infra.celery.queues import Queues


@attr.s(auto_attribs=True)
class UpdatePaymentStatisticEvent(BaseEvent):
    sellerId: int
    buyerId: int
    forPayment: Decimal


@celery.task(name='update_payment_statistic')
def update_payment_statistic(event: UpdatePaymentStatisticEvent):
    publish(Queues.UPDATE_PAYMENT_STATISTIC_QUEUE, MessageTypes.UPDATE_PAYMENT_STATISTIC, event)
