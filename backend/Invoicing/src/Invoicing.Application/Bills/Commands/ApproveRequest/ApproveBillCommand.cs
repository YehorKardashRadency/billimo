using Invoicing.Application.Common.Exceptions;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Application.Common.Models;
using Invoicing.Domain.Entities;
using MediatR;

namespace Invoicing.Application.Bills.Commands.ApproveRequest;
public record ApproveBillCommand(long BillId): IRequest<Result>;

public class ApproveBillCommandHandler : IRequestHandler<ApproveBillCommand, Result>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IApplicationDbContext _context;

    public ApproveBillCommandHandler(ICurrentUserService currentUserService, IApplicationDbContext context)
    {
        _currentUserService = currentUserService;
        _context = context;
    }

    public async Task<Result> Handle(ApproveBillCommand request, CancellationToken cancellationToken)
    {
        var userRole = _currentUserService.Role;
        if (userRole is not (Role.Admin or Role.Director)) throw new ForbiddenAccessException();

        var bill = await _context.Bills.FindAsync(request.BillId) ?? throw new NotFoundException("Bill not found");

        bill.ApprovalStatus = ApprovalStatus.Approved;
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}