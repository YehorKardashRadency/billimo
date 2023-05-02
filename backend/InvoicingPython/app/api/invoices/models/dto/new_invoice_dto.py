from datetime import datetime
import attr
from .invoice_item_dto import InvoiceItemDTO


@attr.s(auto_attribs=True)
class NewInvoiceDTO:
    id: int
    number: str
    createdDate: datetime
    dueDate: datetime
    notes: str
    items: list[InvoiceItemDTO]
    buyerId: int
    buyerEmail: str
    sellerId: int
    isTemplate: bool
    send: bool
    currency: str
    isRegular: bool
    regularCreatingDate: datetime
    templatePreview: str

