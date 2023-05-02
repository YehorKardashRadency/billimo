using Invoicing.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Application.Invoicing.Commands.DeleteInvoice;

public class DeleteInvoiceCommandHandler : IRequestHandler<DeleteInvoiceCommand>
{
    private IApplicationDbContext _context;

    public DeleteInvoiceCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteInvoiceCommand request, CancellationToken cancellationToken)
    {
        var invoiceToRemove = await _context.Invoices.FirstAsync(x => x.Id == request.InvoiceId, cancellationToken);
        _context.Invoices.Remove(invoiceToRemove);
        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
