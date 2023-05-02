using Invoicing.Application.Common.Models;
using Invoicing.Application.Common.Models.Administration;
using Invoicing.Application.Invoicing.Queries;
using RestEase;
using PaymentMethodDto = Invoicing.Application.Common.Models.Administration.PaymentMethodDto;

namespace Invoicing.Application.Common.Interfaces;

public interface IAdministrationApi
{
    [Get("/company/getcompanydetails/{companyId}")]
    Task<CompanyDetailsDto> GetCompanyDetails([Path] long companyId);

    [Get("/company/{companyId}/approvalsettings")]
    Task<ApprovalSettings> GetApprovalSettings([Path] long companyId);

    [Get("/company/companies-info")]
    Task<IEnumerable<CompanyModel>> GetCompaniesInfo([Query] IEnumerable<long?> companyIds);
    [Get("/company/getcompanies")]
    Task<IEnumerable<CompanyDto>> GetCompanies(
        [Header("claim_id")] string claimId,
        [Header("claim_sub")] string claimSub,
        [Header("claim_role")] string claimRole,
        [Header("claim_companyid")] string claimCompanyId,
        [Query] IEnumerable<long> filterId,
        [Query] string? SearchString = null);

    [Get("payments/methodsInfo")]
    Task<IEnumerable<PaymentMethodDto>> GetPaymentMethods(
        [Header("claim_id")] string claimId,
        [Header("claim_sub")] string claimSub,
        [Header("claim_role")] string claimRole,
        [Header("claim_companyid")] string claimCompanyId,
        [Query] IEnumerable<long> filterId);


    [Get("payments/check-methods")]
    Task<List<PaymentMethodsInfoDto>> GetPaymentMethodsForCheck(
        [Header("claim_id")] string claimId,
        [Header("claim_sub")] string claimSub,
        [Header("claim_role")] string claimRole,
        [Header("claim_companyid")] string claimCompanyId);

    [Get("payments/methods")]
    Task<IEnumerable<PaymentMethodDto>> GetPaymentMethodsType(
    [Header("claim_id")] string claimId,
    [Header("claim_sub")] string claimSub,
    [Header("claim_role")] string claimRole,
    [Header("claim_companyid")] string claimCompanyId,
    [Query] IEnumerable<long> filterId);

}