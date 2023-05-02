
using AutoMapper;
using Invoicing.Application.Bills.Queries.ExportSentBills;
using Invoicing.Application.Bills.Queries.SentBills;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Domain.Entities;

namespace Invoicing.Application.Bills.Queries.ReceivedBills;
public class MapExportSentBillsExternalData : IMappingAction<Bill, ExportSentBillsDto>
{
    private readonly IBillsExternalData _billsExternalData;
    public MapExportSentBillsExternalData(
        IBillsExternalData billsExternalData
        )
    {
        _billsExternalData = billsExternalData;
    }
    public void Process(Bill source, ExportSentBillsDto destination, ResolutionContext context)
    {
        if (_billsExternalData.PaymentMethods != null)
        {
            destination.PaymentMethod = _billsExternalData.PaymentMethods
                .Where(x => x.Id == source.PaymentMethodId)
                .Select(x => x.MethodType.ToString())
                .FirstOrDefault() ?? "";
        }
    }
}
