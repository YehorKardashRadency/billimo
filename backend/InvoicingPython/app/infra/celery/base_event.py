import uuid
from datetime import datetime


class BaseEvent:
    id = uuid.uuid4()
    creationDate = datetime.utcnow()
