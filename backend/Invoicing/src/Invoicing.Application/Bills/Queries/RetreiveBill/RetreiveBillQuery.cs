using AutoMapper;
using AutoMapper.QueryableExtensions;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Application.Invoicing.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Application.Bills.Queries.RetrieveBill;
public class RetrieveBillQuery: IRequest<BillPaymentDto>
{
    public long BillId { get; set; }
}

public class RetrieveBillQueryHandler : IRequestHandler<RetrieveBillQuery, BillPaymentDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public RetrieveBillQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<BillPaymentDto> Handle(RetrieveBillQuery request, CancellationToken cancellationToken)
    {
        var bill = await _context.Bills
            .Include(x => x.Invoice)
            .Where(x => x.Id == request.BillId)
            .ProjectTo<BillPaymentDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

        return bill;
    }
}
