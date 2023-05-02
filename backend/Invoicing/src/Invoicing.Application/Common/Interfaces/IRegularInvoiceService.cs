namespace Invoicing.Application.Common.Interfaces;

public interface IRegularInvoiceService
{
    Task CreateNextInvoice(long rootInvoiceId, CancellationToken cancellationToken);
}
