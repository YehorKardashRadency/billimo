import threading

import pika
from flask import Flask
from pika.adapters.blocking_connection import BlockingChannel

from app.core.consumer import Consumer


class ConsumerManager:
    connection: pika.BlockingConnection
    channel: BlockingChannel

    def init_app(self, app: Flask):
        parameters = pika.URLParameters(app.config['RABBITMQ_CONNECTION'])
        self.connection = pika.BlockingConnection(parameters)
        self.channel = self.connection.channel()

    def add_consumer(self, consumer: Consumer):
        self.channel.queue_declare(consumer.queue, durable=True)
        self.channel.basic_consume(consumer.queue, consumer.callback, auto_ack=True)

    def add_consumers(self, consumers: list[Consumer]):
        for consumer in consumers:
            self.add_consumer(consumer)

    def start(self):
        self.channel.start_consuming()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.connection.close()


def run_consumer_manager(manager: ConsumerManager):
    def run():
        print("Starting consumer manager")
        with manager as instance:
            instance.start()

    consumer_thread = threading.Thread(target=run)
    consumer_thread.daemon = True
    consumer_thread.start()


consumer_manager = ConsumerManager()
