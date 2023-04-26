from datetime import datetime
from decimal import Decimal
import attr


@attr.s(auto_attribs=True)
class InvoiceItemDTO:
    description: str
    price: Decimal
    metric: str
    count: int
    subtotal: Decimal


@attr.s(auto_attribs=True)
class CompanyDTO:
    id: int
    name: str
    email: str
    logo: str


@attr.s(auto_attribs=True)
class InvoiceDTO:
    id: int
    number: str
    createdDate: datetime
    dueDate: datetime
    notes: str
    currency: str
    buyerId: int
    sellerId: int
    total: Decimal
    approvalStatus: int
    type: str
    paymentStatus: str
    category: str
    templatePreview: str
    items: list[InvoiceItemDTO]
