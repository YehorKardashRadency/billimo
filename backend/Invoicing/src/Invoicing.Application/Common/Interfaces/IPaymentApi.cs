using Invoicing.Application.Common.Models;
using RestEase;

namespace Invoicing.Application.Common.Interfaces;

public interface IPaymentApi
{
    [Post("/Companies/companies-info")]
    Task<IEnumerable<CompanyModel>> GetCompaniesInfo([Body]IEnumerable<long?> companyIds);
    
}