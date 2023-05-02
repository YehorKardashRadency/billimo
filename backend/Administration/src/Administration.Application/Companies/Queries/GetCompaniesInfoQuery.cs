using Administration.Application.Common.Interfaces;
using Administration.Application.Companies.Dto;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Companies.Queries;

public class GetCompaniesInfoQuery:IRequest<IEnumerable<CompanyDto>>
{
    public IEnumerable<long> CompanyIds { get; set; }
}


public class GetCompaniesInfoQueryHandler : IRequestHandler<GetCompaniesInfoQuery, IEnumerable<CompanyDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCompaniesInfoQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CompanyDto>> Handle(GetCompaniesInfoQuery request, CancellationToken cancellationToken)
    {
        var companyModels = new List<CompanyDto>();
        if (request.CompanyIds != null)
        {
            foreach (var id in request.CompanyIds)
            {
                var company = await _context.Companies.FirstAsync(x => x.Id == id, cancellationToken);
                companyModels.Add(_mapper.Map<CompanyDto>(company));
            }
        }

        return companyModels;
    }
}