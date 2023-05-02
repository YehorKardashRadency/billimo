using AutoMapper;
using Invoicing.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Application.Bills.Queries.GetInvoiceNumber;

public readonly record struct GetInvoiceNumberRequest()
    : IRequest<ResponseGetInvoiceNumber>;

public class GetInvoiceNumberQueryHandler:IRequestHandler<GetInvoiceNumberRequest,ResponseGetInvoiceNumber>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetInvoiceNumberQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    
    public async Task<ResponseGetInvoiceNumber> Handle(GetInvoiceNumberRequest request, CancellationToken cancellationToken)
    {
        var invoiceNumber = await _context.Invoices.MaxAsync(x=>x.Number);
        var response = new ResponseGetInvoiceNumber() { NewInvoiceNumber = invoiceNumber + 1 };
        return response;
    }
}