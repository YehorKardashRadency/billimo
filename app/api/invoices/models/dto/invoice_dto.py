from datetime import datetime
from decimal import Decimal
import attr
from .invoice_item_dto import InvoiceItemDTO


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


@attr.s(auto_attribs=True)
class InvoiceNumberDTO:
    newInvoiceNumber: int
