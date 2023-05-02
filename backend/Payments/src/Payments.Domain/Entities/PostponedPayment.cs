using Payments.Domain.Common;

namespace Payments.Domain.Entities;
public class PostponedPayment : BaseEntity
{
    public decimal Amount { get; set; }
    public string Description { get; set; } = null!;
    public DateOnly PayDate { get; set; }
    public bool Paid { get; set; } = false;

    public PostponedPaymentInfo PostponedPaymentInfo { get; set; } = null!;
    public long PostponedPaymentInfoId { get; set; }

    public PostponedPaymentType PostponedPaymentType { get; set; }
}
