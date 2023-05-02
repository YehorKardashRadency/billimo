using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Payments.Application.Common.Extensions;
using Payments.Application.Common.Interfaces;
using Payments.Application.Common.Models;
using Payments.Domain.Entities;

namespace Payments.Application.Transactions.Queries.GetTransactionsWithPagination;

public record GetTransactionsWithPaginationQuery(string? SearchString, int Page, int Take,
    int? Days, bool IsDescending=true) : IRequest<PaginatedList<TransactionModel>>;


public class GetTransactionsWithPaginationQueryHandler : IRequestHandler<GetTransactionsWithPaginationQuery, PaginatedList<TransactionModel>>
{
    private readonly ICurrentUserService _userService;
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetTransactionsWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper,
        ICurrentUserService userService)
    {
        _context = context;
        _mapper = mapper;
        _userService = userService;
    }

    public async Task<PaginatedList<TransactionModel>> Handle(GetTransactionsWithPaginationQuery request, CancellationToken cancellationToken)
    {
        var companyId = _userService.Companyid;
        
        var selector = _context.Transactions
            .Include(x => x.Buyer)
            .Include(x => x.Seller)
            .Where(x => x.BuyerId == companyId || x.SellerId == companyId);
        
        if (!string.IsNullOrEmpty(request.SearchString))
            selector = selector.Where(x =>
                (x.BuyerId == companyId && x.Seller.Name.ToLower().Contains(request.SearchString.ToLower())) ||
                (x.SellerId == companyId && x.Buyer.Name.ToLower().Contains(request.SearchString.ToLower())));
        
        if (request.Days.HasValue)
        {
            DateTime startDate = DateTime.UtcNow.AddDays(-request.Days.Value);
            DateTime endDate = DateTime.UtcNow;
        
            selector = selector.Where(x => x.CreatedDate >= startDate && x.CreatedDate <= endDate);
        }
        
        var query = request.IsDescending
            ? selector.OrderByDescending(x => x.CreatedDate)
            : selector.OrderBy(x => x.CreatedDate);
        
        var transactions = await query.Pagination(request.Page, request.Take); 
        var list = _mapper.Map<IReadOnlyCollection<TransactionModel>>(transactions.Items);
        
        return new PaginatedList<TransactionModel>(list, transactions.TotalCount, request.Take);
       
    }
}