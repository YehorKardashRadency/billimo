from datetime import datetime
from decimal import Decimal
from typing import Optional

import attr

from .company_dto import CompanyDTO
from .invoice_item_dto import InvoiceItemDTO


@attr.s(auto_attribs=True)
class InvoiceDTO:
    id: int
    number: int
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
    company: Optional[CompanyDTO]
    items: list[InvoiceItemDTO]


@attr.s(auto_attribs=True)
class InvoiceNumberDTO:
    newInvoiceNumber: int
