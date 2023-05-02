using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Models;
using Administration.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Companies.Commands;

public record ToggleDefaultAddressCommand(long AddressId) : IRequest<Result>;

public class ToggleDefaultAddressCommandHandler : IRequestHandler<ToggleDefaultAddressCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public ToggleDefaultAddressCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result> Handle(ToggleDefaultAddressCommand request, CancellationToken cancellationToken)
    {
        var address = await _context.Addresses.FindAsync(request.AddressId);
        var company = await _context.Companies.FindAsync(_currentUserService.Companyid);
        if (company == null) throw new NotFoundException("Company not found");
        if (address == null) throw new BadRequestException("Wrong ID was given");
        if (_currentUserService.Role is not (Role.Admin or Role.Director))
            throw new UnauthorizedAccessException("You can't change the address");
        if (address.Id != company.DefaultAddressId)
            address.Company.DefaultAddressId = address.Id;
        else throw new BadRequestException("Can't toggle current default address");
        
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}