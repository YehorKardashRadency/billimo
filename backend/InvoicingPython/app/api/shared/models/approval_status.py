from enum import Enum


class ApprovalStatus(Enum):
    NotSet = 0
    Approved = 1
    Pending = 2
    RequiresUpdates = 3
