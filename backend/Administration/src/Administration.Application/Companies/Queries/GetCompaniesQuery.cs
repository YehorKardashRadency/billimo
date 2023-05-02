using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Companies.Dto;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Administration.Application.Companies.Queries;
public class GetCompaniesQuery : IRequest<IEnumerable<CompanyDto>>
{
    public IEnumerable<long>? filterId { get; set; }
    public string? SearchString { get; set; }
}

public class GetCompaniesQueryHandler : IRequestHandler<GetCompaniesQuery, IEnumerable<CompanyDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;
    public GetCompaniesQueryHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<IEnumerable<CompanyDto>> Handle(GetCompaniesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Companies.AsNoTracking()
            .Where(x => x.Id != _currentUserService.Companyid);

        if (request.filterId != null)
        {
            query = query.Where(x => request.filterId.Contains(x.Id));
        }

        if (request.SearchString != null)
        {
            query = query.Where(x => x.Name.ToLower().Contains(request.SearchString.ToLower()));
        }

        var resultQuery = query.Include(c => c.Addresses)
            .ProjectTo<CompanyDto>(_mapper.ConfigurationProvider);

        return await resultQuery.ToListAsync() ?? throw new NotFoundException();
    }
}
