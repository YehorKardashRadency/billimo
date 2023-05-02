import attr


@attr.s(auto_attribs=True)
class CancelBillDTO:
    billId: int
    companyId: int
    cancellationReason: str
