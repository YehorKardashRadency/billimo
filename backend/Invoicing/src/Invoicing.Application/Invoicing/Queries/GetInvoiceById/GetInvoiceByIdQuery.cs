using AutoMapper;
using Invoicing.Application.Common.Exceptions;
using Invoicing.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Application.Invoicing.Queries;

public readonly record struct GetInvoiceByIdRequest(long id)
    : IRequest<GetInvoiceDto>;

public class GetInvoiceByIdQuery : IRequestHandler<GetInvoiceByIdRequest, GetInvoiceDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;


    public GetInvoiceByIdQuery(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<GetInvoiceDto> Handle(GetInvoiceByIdRequest request, CancellationToken cancellationToken)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Buyer)
            .Include(i => i.Seller)
            .Include(i => i.Items)
            .FirstOrDefaultAsync(x => x.Id == request.id, cancellationToken);
        if (invoice == null) throw new NotFoundException();
        return _mapper.Map<GetInvoiceDto>(invoice);
    }
}
