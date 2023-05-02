using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Invoicing.Application.Common.Models.Administration;

namespace Invoicing.Application.Common.Interfaces;
public interface IBillsExternalData
{
    public IEnumerable<CompanyDto>? Companies { get; set; }
    public IEnumerable<PaymentMethodDto>? PaymentMethods { get; set; }
    Task Download(IList<long> filterCompanyId, IList<long> filterPaymentMethodsId);
    Task Download(IList<long?> filterCompanyId, IList<long> filterPaymentMethodsId);
    public Task<List<PaymentMethodsInfoDto>> GetPaymentMethodsForCheck();
}