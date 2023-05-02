import attr


@attr.s(auto_attribs=True)
class QuickActionsDTO:
    approveBills: int
    payBills: int
    currentInvoices: int
    approveInvoices: int
