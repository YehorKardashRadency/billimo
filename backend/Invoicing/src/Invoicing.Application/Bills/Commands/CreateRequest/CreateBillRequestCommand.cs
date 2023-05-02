using Invoicing.Application.Common.Exceptions;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Application.Bills.Commands.CreateRequest;
public class CreateBillRequestCommand : IRequest
{
    public long BillId { get; set; }
}

public class CreateBillRequestCommandHandler : IRequestHandler<CreateBillRequestCommand>
{
    private readonly IApplicationDbContext _context;

    public CreateBillRequestCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(CreateBillRequestCommand request, CancellationToken cancellationToken)
    {
        var bill = await _context.Bills.FirstOrDefaultAsync(b => b.Id == request.BillId);

        if (bill == null) throw new NotFoundException("Bill with given ID was not found");

        bill.ApprovalStatus = ApprovalStatus.Pending;

        _context.Bills.Update(bill);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
