using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Models;
using Administration.Application.Companies.Dto;
using Administration.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Companies.Commands;

public record AddAddressCommand(AddressDtoReq Dto, long UserId) : IRequest<Result>;

public class AddAddressComandHandler: IRequestHandler<AddAddressCommand,Result>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public AddAddressComandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result> Handle(AddAddressCommand request, CancellationToken cancellationToken)
    {
        if (request.Dto.Id != null) throw new BadRequestException("New address should not have id");
        var newAddress = _mapper.Map<Address>(request.Dto);
        
        var user = await _context.Users
            .Include(u=>u.Company)
            .FirstOrDefaultAsync(u=>u.Id==request.UserId, cancellationToken: cancellationToken);
        if (user is not {Role: Role.Admin or Role.Director})
            throw new UnauthorizedAccessException("You can't add the address");
        newAddress.CompanyId = user.CompanyId;
        _context.Addresses.Add(newAddress);
        await _context.SaveChangesAsync(cancellationToken);
        if (request.Dto.IsDefault)
            user.Company.DefaultAddressId = newAddress.Id;
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}