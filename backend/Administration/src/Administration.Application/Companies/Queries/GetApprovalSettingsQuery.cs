using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Companies.Dto;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Companies.Queries;
public class GetApprovalSettingsQuery: IRequest<ApprovalSettingsDto>
{
    public long CompanyId { get; set; }
}

public class GetApprovalSettingsQueryHandler: IRequestHandler<GetApprovalSettingsQuery, ApprovalSettingsDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetApprovalSettingsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ApprovalSettingsDto> Handle(GetApprovalSettingsQuery request, CancellationToken cancellationToken)
    {
        var settings = await _context.Companies
            .Where(x => x.Id == request.CompanyId)
            .ProjectTo<ApprovalSettingsDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync() ?? throw new NotFoundException();

        return settings;
    }
}