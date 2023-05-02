using Payments.Domain.Common;

namespace Payments.Domain.Entities;
public class PlaidTransfer : BaseEntity
{
    public string TransferId { get; set; } = string.Empty;

    public Transaction? Transaction { get; set; }

    public long TransactionId { get; set; }

    public bool Buyer { get; set; }

    public PlaidTransferEventType PlaidTransferEventType { get; set; }

    public bool TransactionStatusUpdated { get; set; }
}