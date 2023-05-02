using Payments.Domain.Common;

namespace Payments.Domain.Entities;
public class PostponedPaymentInfo: BaseEntity
{
    public PostponedPaymentInfo()
    {
        Payments = new List<PostponedPayment>();
    }

    public string AccessToken { get; set; } = null!;
    public string AccountId { get; set; } = null!;

    public string IpAddress { get; set; } = null!;
    public string UserAgent { get; set; } = null!;

    public long TransactionId { get; set; }
    public Transaction Transaction { get; set; } = null!;

    public ICollection<PostponedPayment> Payments { get; set; }
}
