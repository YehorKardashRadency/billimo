namespace Payments.Domain.Entities;
public enum TransactionStatus
{
    Pending,
    Cancelled,
    Failed,
    Posted,
    Settled
}
