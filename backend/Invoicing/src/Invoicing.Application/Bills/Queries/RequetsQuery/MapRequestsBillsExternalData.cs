using AutoMapper;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Domain.Entities;

namespace Invoicing.Application.Bills.Queries.RequetsQuery;
public class MapRequestsBillsExternalData : IMappingAction<Bill, RequestsBillsDto>
{
    private readonly IBillsExternalData _billsExternalData;
    public MapRequestsBillsExternalData(IBillsExternalData billsExternalData)
    {
        _billsExternalData = billsExternalData;
    }
    public void Process(Bill source, RequestsBillsDto destination, ResolutionContext context)
    {
        if (_billsExternalData.Companies != null)
        {
            destination.CompanyLogo = _billsExternalData.Companies
                .Where(x => x.Id == source.Invoice.SellerId)
                .Select(x => x.Logo)
                .FirstOrDefault();
        }

        if (_billsExternalData.PaymentMethods != null)
        {
            destination.PaymentMethod = _billsExternalData.PaymentMethods
                .Where(x => x.Id == source.PaymentMethodId)
                .Select(x => x.MethodType.ToString())
                .FirstOrDefault() ?? "";
        }
    }
}
