using Administration.Application.Common.Mappings;
using Administration.Domain.Entities;

namespace Administration.Application.PaymentMethods.Queries;

public class GetPlaidDataDto 
{
    public string CompanyName { get; set; }
    public string AccountId { get; set; }
    public string AccessToken { get; set; }
}