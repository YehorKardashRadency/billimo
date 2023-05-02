using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Companies.Dto;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Companies.Queries;

public record GetAddressesQuery(long CompanyId) : IRequest<AddressesDTO>;
public class GetAddressesQueryHandler : IRequestHandler<GetAddressesQuery,AddressesDTO>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetAddressesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<AddressesDTO> Handle(GetAddressesQuery request, CancellationToken cancellationToken)
    {
        var company = await _context.Companies
            .FindAsync(request.CompanyId);
        if (company == null) throw new NotFoundException("Company not found");
        var addresses =  _context.Addresses.Where(a => a.CompanyId == company.Id);
        return new AddressesDTO()
        {
            Addresses = addresses.Select(a => _mapper.Map<AddressDtoRes>(a)).ToList(),
            DefaultAddressId = company.DefaultAddressId
        };
    }
}