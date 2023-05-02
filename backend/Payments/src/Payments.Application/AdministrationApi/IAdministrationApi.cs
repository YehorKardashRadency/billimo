using Payments.Application.Transactions.Dto;
using RestEase;

namespace Payments.Application.AdministrationApi;
public interface IAdministrationApi
{
    [Get("/api/Company/{companyId}/get-plaid-data")]
    Task<GetPlaidDataDto> GetPlaidData([Path] long companyId, [Body] GetPlaidBody? plaidBody);
}
