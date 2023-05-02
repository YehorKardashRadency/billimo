using EventBus.Messages.Events;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Payments.Application.Common.Interfaces;
using Payments.Domain.Entities;

namespace Payments.Application.BillPayment.Commands;
public record UpdateBuyerStatisticCommand(UpdateBuyerStatisticEvent updateBuyerStatisticEvent) : IRequest;

public class UpdateBuyerStatisticCommandHandler : IRequestHandler<UpdateBuyerStatisticCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    public UpdateBuyerStatisticCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateBuyerStatisticCommand request, CancellationToken cancellationToken)
    {
        var statistic = request.updateBuyerStatisticEvent;
        var paymentStatistic = await _context.PaymentStatistics.FirstOrDefaultAsync(p =>
            p.CompanyId == statistic.BuyerId
            && p.Tab == TabType.Receive);

        paymentStatistic!.ForPayment += statistic.ForPayment;
        _context.PaymentStatistics.Update(paymentStatistic);

        await _context.SaveChangesAsync();

        return Unit.Value;
    }
}