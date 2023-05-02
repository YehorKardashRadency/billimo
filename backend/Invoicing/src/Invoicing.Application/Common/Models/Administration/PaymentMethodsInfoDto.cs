using Invoicing.Domain.Entities;

namespace Invoicing.Application.Common.Models.Administration;

public class PaymentMethodsInfoDto
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public long CompanyId { get; set; }
    public string? Additional { get; set; }
    public PaymentMethodType MethodType { get; set; }
}