using Administration.Domain.Entities;

namespace Administration.Application.PaymentMethods.Queries.CheckPaymentMethods;

public class ResponseCheckPaymentMethods
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public long CompanyId { get; set; }
    public string? Additional { get; set; }
    public PaymentMethodType MethodType { get; set; }
    
    public PlaidBankAccount PlaidBankAccount { get; set; } = null!;

    public Company Company { get; set; } = null!;
    
}