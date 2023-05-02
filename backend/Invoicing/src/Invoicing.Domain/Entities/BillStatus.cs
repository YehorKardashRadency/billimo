namespace Invoicing.Domain.Entities;

public enum BillStatus
{
    Unpaid,
    Pending,
    Scheduled,
    InProgress,
    Paid,
    Cancelled,
}