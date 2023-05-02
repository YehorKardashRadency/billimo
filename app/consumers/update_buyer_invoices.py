import json

from sqlalchemy.orm import joinedload
from sqlalchemy import func
from app.api import Bill, Invoice
from app.api.shared.models import Company
from app.core.consumer import Consumer
from app.infra.db import db_session


import attr
from decimal import Decimal
from app.infra.celery import BaseEvent, celery, publish, MessageTypes
from app.infra.queues import Queues

@attr.s(auto_attribs=True)
class UpdateBuyerStatisticEvent(BaseEvent):
    buyerId: int
    forPayment: Decimal


@celery.task(name='update_buyer_statistic')
def update_buyer_statistic(event: UpdateBuyerStatisticEvent):
    publish(Queues.update_buyer_statistic_queue, MessageTypes.UPDATE_BUYER_STATISTIC, event)


def callback(ch, method, properties, body):
    data = json.loads(body)
    message = data['message']
    session = db_session.session()
    buyer = session.query(Company).where(Company.ref_id == message['buyerId']).one_or_none()
    if buyer is None:
        buyer = Company(
            name=message['buyerName'],
            ref_id=message['buyerId'],
        )
        session.add(buyer)
        session.commit()

    bill = session.query(Bill).options(joinedload(Bill.invoice)).get(message['billId'])

    if bill is None:
        print('Can\'t update invoices with new buyer')
        return

    invoices = session.query(Invoice).where(Invoice.buyer_email == bill.invoice.buyer_email).all()
    for invoice in invoices:
        invoice.buyer_id = buyer.id

    session.commit()

    total = session.query(func.sum(Invoice.total)).where(Invoice.buyer_id == buyer.ref_id).scalar()
    event = UpdateBuyerStatisticEvent(
        buyerId=buyer.ref_id,
        forPayment=total
    )
    update_buyer_statistic.delay(event.__dict__)


update_buyer_invoices_consumer = Consumer(Queues.update_buyer_invoices_queue, callback)
