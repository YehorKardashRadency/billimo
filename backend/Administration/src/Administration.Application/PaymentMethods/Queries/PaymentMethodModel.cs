using Administration.Application.Common.Mappings;
using Administration.Domain.Entities;

namespace Administration.Application.PaymentMethods.Queries;
public class PaymentMethodModel: IMapFrom<PaymentMethod>
{
    public long Id { get; set; }
    public string Title { get; set; }
    public string? Additional { get; set; }
    public int MethodType { get; set; }
}
