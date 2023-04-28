import attr
from decimal import Decimal


@attr.s(auto_attribs=True)
class InvoiceItemDTO:
    description: str
    price: Decimal
    metric: str
    count: int
    subtotal: Decimal
