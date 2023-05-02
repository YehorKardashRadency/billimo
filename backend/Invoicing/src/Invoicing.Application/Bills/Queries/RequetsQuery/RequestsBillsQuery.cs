using AutoMapper;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Invoicing.Application.Common.Models;
using Invoicing.Application.Common.Models.Request;
using Invoicing.Application.Common.Mapping;


namespace Invoicing.Application.Bills.Queries.RequetsQuery;

public class RequestsBillsQuery : PaginatedRequest, IRequest<PaginatedList<RequestsBillsDto>>,
    IMapFrom<PaginatedRequest>
{
    public new void Mapping(Profile profile)
    {
        profile.CreateMap<PaginatedRequestDto, RequestsBillsQuery>()
            .IncludeBase<PaginatedRequestDto, PaginatedRequest>();
    }
}

public class RequestsBillsQueryHandler : IRequestHandler<RequestsBillsQuery, PaginatedList<RequestsBillsDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;
    private readonly IBillsExternalData _billsExternalData;

    public RequestsBillsQueryHandler(
        IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService,
        IBillsExternalData billsExternalData)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
        _billsExternalData = billsExternalData;
    }

    public async Task<PaginatedList<RequestsBillsDto>> Handle(RequestsBillsQuery request,
        CancellationToken cancellationToken)
    {
        var query = _context.Bills
            .AsNoTracking()
            .Where(x => x.Invoice.BuyerId == _currentUserService.Companyid &&
                        x.ApprovalStatus == ApprovalStatus.Pending)
            .Include(x => x.Invoice)
            .ThenInclude(i => i.Seller)
            .Include(x => x.Invoice)
            .ThenInclude(i => i.Items)
            .AsQueryable();

        if (request.Search != null)
        {
            query = query
                .Where(x => x.Invoice.Seller.Name.ToLower().Contains(request.Search.ToLower())
                            || ("INV-" + x.Invoice.Number).ToLower().Contains(request.Search.ToLower()));
        }

        query = AddSort(query, request.Sort);
        var totalCount = await query.CountAsync();
        query = query
            .Skip(request.PageIndex * request.PageSize)
            .Take(request.PageSize);

        var bills = await query.ToListAsync();
        if (bills == null)
        {
            return new PaginatedList<RequestsBillsDto>(new List<RequestsBillsDto>(), 0, 1, 1);
        }

        var filterCompanyId = bills
            .Select(x => x.Invoice.SellerId)
            .Distinct()
            .ToList();

        var filterPaymentMethodsId = bills
            .Select(x => x.PaymentMethodId)
            .Distinct()
            .ToList();

        await _billsExternalData.Download(filterCompanyId, filterPaymentMethodsId);

        var billsDto = _mapper.Map<List<RequestsBillsDto>>(bills);
        return new PaginatedList<RequestsBillsDto>(billsDto, totalCount, request.PageIndex + 1, request.PageSize);
    }

    public IQueryable<Bill> AddSort(IQueryable<Bill> query, IEnumerable<Sort> sort)
    {
        var dataSort = sort.FirstOrDefault(x => x.Field == "date");
        if (dataSort != null)
        {
            query = dataSort.direction == SortDirection.descending
                ? query.OrderByDescending(x => x.Invoice.DueDate)
                : query.OrderBy(x => x.Invoice.DueDate);
        }

        var numberSort = sort.FirstOrDefault(x => x.Field == "number");
        if (numberSort != null)
        {
            query = numberSort.direction == SortDirection.descending
                ? query.OrderByDescending(x => x.Invoice.Number)
                : query.OrderBy(x => x.Invoice.Number);
        }

        var amountSort = sort.FirstOrDefault(x => x.Field == "amount");
        if (amountSort != null)
        {
            query = amountSort.direction == SortDirection.descending
                ? query.OrderByDescending(x => x.Invoice.Total)
                : query.OrderBy(x => x.Invoice.Total);
        }

        var companySort = sort.FirstOrDefault(x => x.Field == "companyName");
        if (companySort != null)
        {
            query = companySort.direction == SortDirection.descending
                ? query.OrderByDescending(x => x.Invoice.Seller.Name)
                : query.OrderBy(x => x.Invoice.Seller.Name);
        }

        return query;
    }
}