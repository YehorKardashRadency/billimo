using System.Collections.Immutable;
using AutoMapper;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Application.Common.Models;
using Invoicing.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RestEase;

namespace Invoicing.Application.Invoicing.Queries.GetCurrentInvoices;

public record GetCurrentInvoicesQuery(InvoiceType Type,bool TakeRegular = false) : IRequest<IEnumerable<InvoiceDto>>;

public class GetCurrentInvoicesQueryHandler : IRequestHandler<GetCurrentInvoicesQuery, IEnumerable<InvoiceDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<GetCurrentInvoicesQueryHandler> _logger;
    private readonly ICurrentUserService _currentUser;
    
    private readonly IAdministrationApi _administrationApi;
    public GetCurrentInvoicesQueryHandler(IApplicationDbContext context, IMapper mapper,
        ILogger<GetCurrentInvoicesQueryHandler> logger, ICurrentUserService currentUser, IAdministrationApi administrationApi)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
        _currentUser = currentUser;
        _administrationApi = administrationApi;
    }

    public async Task<IEnumerable<InvoiceDto>> Handle(GetCurrentInvoicesQuery request, CancellationToken cancellationToken)
    {
        var invoices = await _context.Invoices
            .Include(x => x.Items)
            .Include(x => x.Seller)
            .Include(x => x.Buyer)
            .Where(x => x.Seller.RefId == _currentUser.Companyid &&
            x.Type == request.Type && request.TakeRegular == x.IsRegular)
            .ToListAsync();

        var requestedCompanies = invoices.Select(x => x.Buyer)
            .Where(x => x != null)
            .Select(x => (long?)x.RefId)
            .Distinct().ToList();
        var companies = requestedCompanies.Count!=0 
            ? await _administrationApi.GetCompaniesInfo(requestedCompanies)
            : await Task.FromResult<IEnumerable<CompanyModel>>(ImmutableArray<CompanyModel>.Empty);
        var invoiceModels = _mapper.Map<IEnumerable<InvoiceDto>>(invoices);
        var mergedInvoices = invoiceModels.Join(companies, i => i.BuyerId, c => c.Id, (invoice, company) =>
        {
            invoice.Company = company;
            return invoice;
        }).ToList();

        return invoiceModels.Where(x => x.BuyerId is null).Concat(mergedInvoices);
    }
}
