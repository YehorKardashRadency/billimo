using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Models;
using Administration.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Companies.Commands;

public record DeleteAddressCommand(long AddressId, long UserId): IRequest<Result>;

public class DeleteAddressCommandHandler: IRequestHandler<DeleteAddressCommand,Result>
{
    private readonly IApplicationDbContext _context;

    public DeleteAddressCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(DeleteAddressCommand request, CancellationToken cancellationToken)
    {
        var address = await _context.Addresses.FindAsync(request.AddressId);
        if (address == null) throw new NotFoundException("Address not found");
        var user = await _context.Users
            .Include(u=>u.Company)
            .FirstOrDefaultAsync(u=>u.Id==request.UserId, cancellationToken: cancellationToken);
        if (address.CompanyId != user!.CompanyId)
            throw new ForbiddenAccessException();
        if (user is not {Role: Role.Admin or Role.Director})
            throw new UnauthorizedAccessException("You can't add the address");
        if (address.Id == user.Company.DefaultAddressId)
        {
            user.Company.DefaultAddressId = null;
        }
        _context.Addresses.Remove(address);
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}