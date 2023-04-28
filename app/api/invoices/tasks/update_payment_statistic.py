from decimal import Decimal

import attr

from app.infra.celery import BaseEvent, Queues, celery, publish, MessageTypes


@attr.s(auto_attribs=True)
class UpdatePaymentStatisticEvent(BaseEvent):
    sellerId: int
    buyerId: int
    forPayment: Decimal


@celery.task(name='update_payment_statistic')
def update_payment_statistic(event: UpdatePaymentStatisticEvent):
    publish(Queues.update_payment_statistic_queue,MessageTypes.UPDATE_PAYMENT_STATISTIC, event)


