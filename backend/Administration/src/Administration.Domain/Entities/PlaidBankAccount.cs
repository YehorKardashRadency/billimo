using Administration.Domain.Common;

namespace Administration.Domain.Entities;
public class PlaidBankAccount: BaseEntity
{
    public string AccountId { get; set; } = null!;

    public long PlaidBankIntegrationId { get; set; }
    public PlaidBankIntegration PlaidBankIntegration { get; set; }

    public long PaymentMethodId { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
}
