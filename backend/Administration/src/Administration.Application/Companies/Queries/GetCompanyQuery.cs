using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Companies.Dto;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Companies.Queries;
public class GetCompanyQuery : IRequest<CompanyDto>
{
}

public class GetCompanyQueryHandler : IRequestHandler<GetCompanyQuery, CompanyDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;
    public GetCompanyQueryHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<CompanyDto> Handle(GetCompanyQuery request, CancellationToken cancellationToken)
    {
        return await _context.Companies.Include(c => c.Addresses)
               .Where(x => x.Id == _currentUserService.Companyid)
               .ProjectTo<CompanyDto>(_mapper.ConfigurationProvider)
               .FirstOrDefaultAsync() ?? throw new NotFoundException();
    }
}
