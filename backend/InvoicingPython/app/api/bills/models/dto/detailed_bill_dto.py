from typing import Optional

from app.api.invoices.models.dto import InvoiceDTO, CompanyDTO
import attr

@attr.s(auto_attribs=True)
class DetailedBillDTO:
    id: int
    status: str
    approvalStatus: str
    paymentMethodId: int
    invoice: InvoiceDTO
    buyer: Optional[CompanyDTO]
    seller: Optional[CompanyDTO]
