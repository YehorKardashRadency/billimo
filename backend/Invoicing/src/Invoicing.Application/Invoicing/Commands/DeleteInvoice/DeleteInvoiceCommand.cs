using MediatR;

namespace Invoicing.Application.Invoicing.Commands.DeleteInvoice;

public class DeleteInvoiceCommand:IRequest
{
    public int InvoiceId { get; set; }
}
