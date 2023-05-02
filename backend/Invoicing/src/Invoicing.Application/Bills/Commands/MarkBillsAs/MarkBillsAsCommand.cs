using Invoicing.Application.Bills.Commands.MarkBillsAs;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Application.Bills.Commands.MarkBillAs;
public class MarkBillsAsCommand: IRequest
{
    public MarkBillsDto MarkBills { get; set; }
}

public class MarkBillsAsCommandHandler : IRequestHandler<MarkBillsAsCommand>
{
    private readonly IApplicationDbContext _context;

    public MarkBillsAsCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(MarkBillsAsCommand request, CancellationToken cancellationToken)
    {
        var bills = await _context.Bills.Where(x => request.MarkBills.Bills.Contains(x.Id)).ToListAsync();

        if (!Enum.TryParse<BillStatus>(request.MarkBills.Status, out var status))
            throw new ArgumentException(nameof(request.MarkBills.Status));

        bills.ForEach(x => x.Status = status);

        _context.Bills.UpdateRange(bills);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
