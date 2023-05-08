from kombu import Exchange, Producer
from .celery_extension import celery
from .base_event import BaseEvent
from .envelope import MessageEnvelope


def publish(exchange: str, message_type: list[str], event: BaseEvent):
    exchange = Exchange(exchange, type='direct')
    with celery.connection() as connection:
        producer = Producer(connection)
        message = MessageEnvelope(message_type=message_type, message=event).__dict__
        print("Sending message ", message)
        producer.publish(message, exchange=exchange, routing_key='')

