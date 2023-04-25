from enum import Enum


class BillStatus(Enum):
    Unpaid = 0
    Pending = 1
    Scheduled = 2
    InProgress = 3
    Paid = 4
    Cancelled = 5