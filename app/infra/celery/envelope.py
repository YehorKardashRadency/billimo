import uuid
from typing import Any
from .base_event import BaseEvent


class MessageEnvelope:
    messageId: uuid.uuid4()

    messageType: list[str]

    message: Any

    def __init__(self, message_type: list[str], message: BaseEvent):
        self.messageType = message_type
        self.message = message
