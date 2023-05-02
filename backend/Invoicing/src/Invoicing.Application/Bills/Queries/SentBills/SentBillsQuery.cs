using AutoMapper;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Application.Common.Mapping;
using Invoicing.Application.Common.Models;
using Invoicing.Application.Common.Models.Request;
using Invoicing.Application.MyEntity.Queries;
using Invoicing.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;


namespace Invoicing.Application.Bills.Queries.SentBills;
public class SentBillsQuery : PaginatedRequest, IRequest<PaginatedList<SentBillsDto>>, IMapFrom<PaginatedRequest>
{
    public new void Mapping(Profile profile)
    {
        profile.CreateMap<PaginatedRequestDto, SentBillsQuery>()
            .IncludeBase<PaginatedRequestDto, PaginatedRequest>();
    }
}

public class SentBillsQueryHandler : IRequestHandler<SentBillsQuery, PaginatedList<SentBillsDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<GetMyEntitiesQueryHandler> _logger;
    private readonly ICurrentUserService _currentUserService;
    private readonly IBillsExternalData _billsExternalData;

    public SentBillsQueryHandler(
        IApplicationDbContext context, 
        IMapper mapper, 
        ILogger<GetMyEntitiesQueryHandler> logger,
        ICurrentUserService currentUserService,
        IBillsExternalData billsExternalData
        )
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
        _currentUserService = currentUserService;
        _billsExternalData = billsExternalData;
    }
    public async Task<PaginatedList<SentBillsDto>> Handle(SentBillsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Bills
                 .AsNoTracking()
                 .Where(x => x.Invoice.SellerId == _currentUserService.Companyid)
                 .Include(x => x.Invoice)
                     .ThenInclude(x => x.Buyer)
                .Include(x => x.BillCancellation)
                    .ThenInclude(x => x.Company)
                 .AsQueryable();

        var statusFilter = request.Filter.FirstOrDefault(x => x.Key == "status");
        if (statusFilter != null)
        {
            query = query.Where(x => x.Status == (BillStatus)Enum.Parse(typeof(BillStatus), statusFilter.Value));
        }

        if (request.Search != null)
        {
            query = query
                .Where(x => x.Invoice.Buyer.Name.ToLower().Contains(request.Search.ToLower())
                         || ("INV-"+x.Invoice.Number).ToLower().Contains(request.Search.ToLower()));
        }

        query = AddSort(query, request.Sort);
        var totalCount = await query.CountAsync();
        query = query
            .Skip(request.PageIndex * request.PageSize)
            .Take(request.PageSize);

        var billResult = await query.ToListAsync();
        if (billResult == null)
        {
            return new PaginatedList<SentBillsDto>(new List<SentBillsDto>(), 0, 1, 1);
        }

        var filterCompanyId = billResult
                .Select(x => x.Invoice.BuyerId)
                .Distinct()
                .ToList();

        var filterPaymentMethodsId = billResult
            .Select(x => x.PaymentMethodId)
            .Distinct()
            .ToList();

        await _billsExternalData.Download(filterCompanyId, filterPaymentMethodsId);
        var billsDto = _mapper.Map<List<SentBillsDto>>(billResult);
        return new PaginatedList<SentBillsDto>(billsDto, totalCount, request.PageIndex + 1, request.PageSize);
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
                ? query.OrderByDescending(x => x.Invoice.Buyer.Name)
                : query.OrderBy(x => x.Invoice.Buyer.Name);
        }

        return query;
    }
}