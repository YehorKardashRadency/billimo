using AutoMapper;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Application.Common.Mapping;
using Invoicing.Application.Common.Models.Request;
using Invoicing.Application.MyEntity.Queries;
using Invoicing.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Invoicing.Application.Bills.Queries.ExportSentBills;

public class ExportSentBillsQuery : Common.Models.Request.Request, IRequest<IEnumerable<ExportSentBillsDto>>,
    IMapFrom<PaginatedRequest>
{
    public new void Mapping(Profile profile)
    {
        profile.CreateMap<RequestDto, ExportSentBillsQuery>()
            .IncludeBase<RequestDto, Common.Models.Request.Request>();
    }
}

public class ExportSentBillsQueryHandler : IRequestHandler<ExportSentBillsQuery, IEnumerable<ExportSentBillsDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<GetMyEntitiesQueryHandler> _logger;
    private readonly ICurrentUserService _currentUserService;
    private readonly IBillsExternalData _billsExternalData;

    public ExportSentBillsQueryHandler(
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

    public async Task<IEnumerable<ExportSentBillsDto>> Handle(ExportSentBillsQuery request,
        CancellationToken cancellationToken)
    {
        var query = _context.Bills
            .AsNoTracking()
            .Where(x => x.Invoice.SellerId == _currentUserService.Companyid)
            .Include(x => x.Invoice)
            .ThenInclude(x => x.Buyer)
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

        var billResult = await query.ToListAsync();
        if (billResult == null)
        {
            return new List<ExportSentBillsDto>();
        }

        var filterPaymentMethodsId = billResult
            .Select(x => x.PaymentMethodId)
            .Distinct()
            .ToList();

        await _billsExternalData.Download(new List<long>(), filterPaymentMethodsId);
        var billsDto = _mapper.Map<List<ExportSentBillsDto>>(billResult);

        return billsDto;
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