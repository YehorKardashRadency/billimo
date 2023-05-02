from app.infra.db import db_session
from app.api.shared.models import Company
from app.core.consumer import Consumer
from app.infra.celery.queues import Queues
import json


def callback(ch, method, properties, body):
    data = json.loads(body)
    message = data['message']
    session = db_session.session()
    company = session.query(Company).where(Company.ref_id == message['refId']).one_or_none()
    if company is not None:
        company.name = message['name']
        session.commit()
        return

    company = Company(
        ref_id=message['refId'],
        name=message['name']
    )
    session.add(company)
    session.commit()
    session.close()


update_company_info_consumer = Consumer(Queues.UPDATE_COMPANY_INFO_QUEUE, callback)
