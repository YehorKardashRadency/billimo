using Invoicing.Application.Common.Exceptions;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Application.Invoicing.Commands.ArchiveInvoice;
public class ArchiveInvoiceCommand : IRequest
{
    public long InvoiceId { get; set; }
}

public class ArchiveInvoiceCommandHandler : IRequestHandler<ArchiveInvoiceCommand>
{
    private readonly IApplicationDbContext _context;

    public ArchiveInvoiceCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(ArchiveInvoiceCommand request, CancellationToken cancellationToken)
    {
        var invoice = await _context.Invoices.FindAsync(request.InvoiceId)
            ?? throw new NotFoundException();

        invoice.Type = InvoiceType.Archived;

        _context.Invoices.Update(invoice);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}