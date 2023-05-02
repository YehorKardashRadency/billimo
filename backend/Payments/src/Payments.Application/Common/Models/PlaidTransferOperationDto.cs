using Payments.Application.AdministrationApi;
using Payments.Application.Common.Mappings;
using Payments.Domain.Entities;

namespace Payments.Application.Common.Models;
public class PlaidTransferOperationDto : IMapFrom<PostponedPayment>
{
    public GetPlaidDataDto ClientInformation { get; set; }
    public string Description { get; set; }
    public decimal Amount { get; set; }
    public string IpAddress { get; set; }
    public string UserAgent { get; set; }

    public Transaction Transaction { get; set; }
}
