from datetime import datetime
from decimal import Decimal
import attr

@attr.s(auto_attribs=True)
class BillDTO:
    id: int
    invoiceId: int
    invoiceNumber: int
    dueDate: datetime
    createdDate: datetime
    paymentMethod: str
    paymentMethodId: int
    status: str
    companyName: str
    companyLogo: str
    companyId: int
    amount: Decimal
    currency: str
