using Payments.Domain.Common;

namespace Payments.Domain.Entities;

public class Transaction : BaseEntity
{
    public long BillId { get; set; }
    public decimal Amount { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public long BuyerId { get; set; }
    public Company Buyer { get; set; } = null!;

    public long SellerId { get; set; }
    public Company Seller { get; set; } = null!;

    public TransactionStatus Status { get; set; } = TransactionStatus.Pending;

    public ICollection<PlaidTransfer> PlaidTransfers { get; set; }
}