using Invoicing.Application.Common.Exceptions;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Application.Common.Models;
using Invoicing.Domain.Entities;
using MediatR;

namespace Invoicing.Application.Invoicing.Commands.ManagePendingInvoice;

public record DeclineInvoiceCommand(long InvoiceId) : IRequest<Result>;

public class DeclineInvoiceCommandHandler : IRequestHandler<DeclineInvoiceCommand, Result>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IApplicationDbContext _context;

    public DeclineInvoiceCommandHandler(ICurrentUserService currentUserService, IApplicationDbContext context)
    {
        _currentUserService = currentUserService;
        _context = context;
    }

    public async Task<Result> Handle(DeclineInvoiceCommand request, CancellationToken cancellationToken)
    {
        var userRole = _currentUserService.Role;
        if (userRole is not (Role.Admin or Role.Director))
        {
            throw new ForbiddenAccessException();
        }

        var invoice = await _context.Invoices.FindAsync(request.InvoiceId);
        if (invoice == null)
        {
            throw new NotFoundException("Invoice not found");
        }

        invoice.ApprovalStatus = ApprovalStatus.RequiresUpdates;
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}