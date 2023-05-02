using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Mappings;
using Administration.Application.Common.Models;
using Administration.Application.Companies.Dto;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;

namespace Administration.Application.Notifications.Queries.GetNotificationsWithPagination;
public class GetNotificationsWithPaginationQuery : IRequest<PaginatedList<NotificationDto>>
{
    public string? SearchString { get; init; }
    public int Page { get; init; }
    public int Take { get; init; }

    public bool IsDescending { get; init; } = true;
    public int? Days { get; init; }
}

public class GetNotificationsWithPaginationQueryHandler: IRequestHandler<GetNotificationsWithPaginationQuery, PaginatedList<NotificationDto>>
{
    private readonly ICurrentUserService _userService;
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetNotificationsWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper, 
        ICurrentUserService userService)
    {
        _context = context;
        _mapper = mapper;
        _userService = userService;
    }

    public async Task<PaginatedList<NotificationDto>> Handle(GetNotificationsWithPaginationQuery request,
            CancellationToken cancellationToken)
    {
        var companyId = _userService.Companyid;

        var selector = _context.Notifications
            .Where(x => x.CompanyId == companyId);

        if (!string.IsNullOrEmpty(request.SearchString))
            selector = selector.Where(x => x.MessageWithoutLinks.ToLower().Contains(request.SearchString.ToLower()));

        if (request.Days.HasValue)
        {
            DateTime startDate = DateTime.UtcNow.AddDays(-request.Days.Value);
            DateTime endDate = DateTime.UtcNow;

            selector = selector.Where(x => x.CreatedDate >= startDate && x.CreatedDate <= endDate);
        }

        var query = request.IsDescending
            ? selector.OrderByDescending(x => x.CreatedDate).AsQueryable()
            : selector.OrderBy(x => x.CreatedDate).AsQueryable();

        var result =  await query
            .ProjectTo<NotificationDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.Page, request.Take);

        return result;
    }
}
