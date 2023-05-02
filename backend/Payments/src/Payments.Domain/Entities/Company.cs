using Payments.Domain.Common;

namespace Payments.Domain.Entities;
public class Company: BaseEntity
{
    public string Name { get; set; }

    public ICollection<Transaction> Buy { get; set; }
    public ICollection<Transaction> Sell { get; set; }

    public ICollection<PaymentStatistic> PaymentStatistics { get; set; }
}
