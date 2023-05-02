using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Companies.Dto;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Companies.Queries;
public class GetCompanyDocumentsQuery: IRequest<CompanyDocumentsDto>
{
}

public class GetCompanyDocumentsQueryHandler : IRequestHandler<GetCompanyDocumentsQuery, CompanyDocumentsDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetCompanyDocumentsQueryHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<CompanyDocumentsDto> Handle(GetCompanyDocumentsQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.Companyid;

        var documents = await _context.Companies
            .Where(x => x.Id == companyId)
            .ProjectTo<CompanyDocumentsDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync() ?? throw new NotFoundException();

        return documents;
    }
}
