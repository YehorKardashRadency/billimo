using Invoicing.Application.Common.Exceptions;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Application.Common.Models;
using Invoicing.Domain.Entities;
using MediatR;

namespace Invoicing.Application.Bills.Commands.DeclineRequest;
public record DeclineBillCommand(long BillId) : IRequest<Result>;

public class DeclineBillCommandHandler : IRequestHandler<DeclineBillCommand, Result>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IApplicationDbContext _context;

    public DeclineBillCommandHandler(ICurrentUserService currentUserService, IApplicationDbContext context)
    {
        _currentUserService = currentUserService;
        _context = context;
    }

    public async Task<Result> Handle(DeclineBillCommand request, CancellationToken cancellationToken)
    {
        var userRole = _currentUserService.Role;
        if (userRole is not (Role.Admin or Role.Director))  throw new ForbiddenAccessException();

        var bill = await _context.Bills.FindAsync(request.BillId) ?? throw new NotFoundException("Bill not found");

        bill.ApprovalStatus = ApprovalStatus.RequiresUpdates;
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
