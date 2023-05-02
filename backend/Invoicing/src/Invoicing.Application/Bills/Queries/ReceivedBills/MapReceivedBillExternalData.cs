
using AutoMapper;
using Invoicing.Application.Bills.Queries.SentBills;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Domain.Entities;

namespace Invoicing.Application.Bills.Queries.ReceivedBills;
public class MapReceivedBillExternalData : IMappingAction<Bill, ReceivedBillsDto>
{
    private readonly IBillsExternalData _billsExternalData;
    public MapReceivedBillExternalData(
        IBillsExternalData billsExternalData
        )
    {
        _billsExternalData = billsExternalData;
    }
    public void Process(Bill source, ReceivedBillsDto destination, ResolutionContext context)
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
