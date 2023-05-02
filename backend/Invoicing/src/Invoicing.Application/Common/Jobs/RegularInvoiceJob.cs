using Invoicing.Application.Common.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Quartz;

namespace Invoicing.Application.Common.Jobs;

public class RegularInvoiceJob : IJob
{
    private readonly IRegularInvoiceService _regularInvoiceService;

    public RegularInvoiceJob(IRegularInvoiceService regularInvoiceService)
    {
        _regularInvoiceService = regularInvoiceService;
    }

    public RegularInvoiceJob()
    {
    }

    public async Task Execute(IJobExecutionContext context)
    {
        var invoiceId = context.JobDetail.JobDataMap.GetLong("InvoiceId");
        await _regularInvoiceService.CreateNextInvoice(invoiceId, context.CancellationToken);
    }
}
