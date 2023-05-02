using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Users.Queries.GetUserSettingsQuery;
public class GetUserSettingsQuery: IRequest<GetUserSettingsDto>
{
}

public class GetUserSettingsQueryHandler : IRequestHandler<GetUserSettingsQuery, GetUserSettingsDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;
    public GetUserSettingsQueryHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<GetUserSettingsDto> Handle(GetUserSettingsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.Id;

        var settings = await _context.Users
            .Where(x => x.Id == userId)
            .ProjectTo<GetUserSettingsDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync() ?? throw new NotFoundException();

        return settings;
    }
}