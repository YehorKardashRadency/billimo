from enum import Enum


class PaymentMethodType(Enum):
    Empty = 0
    Card = 1
    Bank = 2
    Paypal = 3
