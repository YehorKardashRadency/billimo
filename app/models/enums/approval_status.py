from enum import Enum


class ApprovalStatus(Enum):
    Missing = 0
    Approved = 1,
    Pending = 2,
    RequiresUpdates = 3
