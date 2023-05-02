using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Models;
using Administration.Application.Companies.Dto;
using Administration.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Companies.Commands;

public record UpdateAddressCommand(AddressDtoReq Dto, long UserId) : IRequest<Result>;

public class UpdateAddressCommandHandler : IRequestHandler<UpdateAddressCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateAddressCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result> Handle(UpdateAddressCommand request, CancellationToken cancellationToken)
    {
        if (request.Dto.Id == null) throw new BadRequestException("The address ID was not given");
        var address = await _context.Addresses
            .Include(a => a.Company)
            .ThenInclude(c => c.Employees)
            .FirstOrDefaultAsync(a => a.Id == request.Dto.Id, cancellationToken: cancellationToken);
        if (address == null) throw new BadRequestException("Wrong ID was given");
        var user = address.Company.Employees.FirstOrDefault(e => e.Id == request.UserId);
        if (user is not {Role: Role.Admin or Role.Director})
            throw new UnauthorizedAccessException("You can't change the address");
        _mapper.Map(request.Dto, address);
        if (request.Dto.IsDefault)
            address.Company.DefaultAddressId = address.Id;
        else if (address.Company.DefaultAddressId == address.Id)
            address.Company.DefaultAddressId = null;
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}