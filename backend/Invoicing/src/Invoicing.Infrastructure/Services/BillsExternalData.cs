using Invoicing.Application.Common.Interfaces;
using Invoicing.Application.Common.Models.Administration;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;

namespace Invoicing.Infrastructure.Services;
public class BillsExternalData : IBillsExternalData
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IAdministrationApi _administrationApi;
    public BillsExternalData(
        ICurrentUserService currentUserService, IAdministrationApi administrationApi) 
    {
        _currentUserService = currentUserService;
        _administrationApi = administrationApi;
    }

    public IEnumerable<CompanyDto>? Companies { get; set; }
    public IEnumerable<PaymentMethodDto>? PaymentMethods { get; set; }

    public async Task Download(IList<long> filterCompanyId, IList<long> filterPaymentMethodsId)
    {
        var taskCompanies = GetRelatedCompanies(filterCompanyId);
        var taskPaymentMethods = GetRelatedPaymentMethods(filterPaymentMethodsId);
        await Task.WhenAll(taskCompanies, taskPaymentMethods);
        Companies = await taskCompanies;
        PaymentMethods = await taskPaymentMethods;
    }
    
    public async Task Download(IList<long?> filterCompanyId, IList<long> filterPaymentMethodsId)
    {
        List<long> newFilter = filterCompanyId.Where(x => x != null).Select(x => (long)x!).ToList();
        await Download(newFilter, filterPaymentMethodsId);
    }
        
    public async Task<IEnumerable<CompanyDto>> GetRelatedCompanies(IEnumerable<long> filterId)
    {
        return await GetCompanies(filterId) ?? new List<CompanyDto>();
    }
    
    public async Task<IEnumerable<PaymentMethodDto>> GetRelatedPaymentMethods(IEnumerable<long> filterId)
    {
        return await GetPaymentMethods(filterId) ?? new List<PaymentMethodDto>();
    }
    public async Task<List<PaymentMethodsInfoDto>> GetPaymentMethodsForCheck()
    {
        return await _administrationApi.GetPaymentMethodsForCheck(_currentUserService.Id.ToString(),
            _currentUserService.Name,
            _currentUserService.Role.ToString(),
            _currentUserService.Companyid.ToString());
    }
    public Task<IEnumerable<CompanyDto>> GetCompanies(IEnumerable<long> filterId)
    {
        return _administrationApi.GetCompanies(_currentUserService.Id.ToString(),
            _currentUserService.Name,
            _currentUserService.Role.ToString(),
            _currentUserService.Companyid.ToString(),
            filterId
        );
    }
    public Task<IEnumerable<PaymentMethodDto>> GetPaymentMethods(IEnumerable<long> filterId)
    {
        return _administrationApi.GetPaymentMethodsType(_currentUserService.Id.ToString(),
            _currentUserService.Name,
            _currentUserService.Role.ToString(),
            _currentUserService.Companyid.ToString(),
            filterId
        );
    }
    
}