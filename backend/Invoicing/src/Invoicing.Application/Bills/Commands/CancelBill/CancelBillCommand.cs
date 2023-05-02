using AutoMapper;
using Invoicing.Application.Common.Exceptions;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Application.Bills.Commands.CancelBill;
public class CancelBillCommand: IRequest
{
    public CancelBillDto CancelBill { get; set; }
}

public class CancelBillCommandHandler : IRequestHandler<CancelBillCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CancelBillCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(CancelBillCommand request, CancellationToken cancellationToken)
    {
        var bill = await _context.Bills.FirstOrDefaultAsync(x => x.Id == request.CancelBill.BillId)
             ?? throw new NotFoundException();

        bill.Status = BillStatus.Cancelled;
        bill.BillCancellation = new BillCancellation();
        _mapper.Map(request.CancelBill, bill.BillCancellation);

        _context.Bills.Update(bill);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
