using Administration.Domain.Common;

namespace Administration.Domain.Entities;

public class PaymentMethod : BaseEntity
{
    public string Title { get; set; } = null!;
    public string? Additional { get; set; }

    public PaymentMethodType MethodType { get; set; }
    public PlaidBankAccount PlaidBankAccount { get; set; } = null!;

    public Company Company { get; set; } = null!;
    public long CompanyId { get; set; }
}