using EventBus.Messages.Events;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Payments.Application.Common.Interfaces;
using Payments.Domain.Entities;

namespace Payments.Application.BillPayment.Commands;
public record UpdatePaymentStatisticCommand(UpdatePaymentStatisticEvent updatePaymentStatisticEvent) : IRequest;

public class UpdatePaymentStatisticCommandHandler : IRequestHandler<UpdatePaymentStatisticCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    public UpdatePaymentStatisticCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdatePaymentStatisticCommand request, CancellationToken cancellationToken)
    {
        var statistic = request.updatePaymentStatisticEvent;
        var sendPaymentStatistic = await _context.PaymentStatistics.FirstOrDefaultAsync(p =>
            p.CompanyId == statistic.SellerId
            && p.Tab == TabType.Send);

        sendPaymentStatistic!.ForPayment += statistic.ForPayment;
        _context.PaymentStatistics.Update(sendPaymentStatistic);

        if (statistic.BuyerId != null)
        {
            var recievePaymentStatistic = await _context.PaymentStatistics.FirstOrDefaultAsync(p =>
            p.CompanyId == statistic.BuyerId
            && p.Tab == TabType.Receive);

            recievePaymentStatistic!.ForPayment += statistic.ForPayment;
            _context.PaymentStatistics.Update(recievePaymentStatistic);
        }

        await _context.SaveChangesAsync();

        return Unit.Value;
    }
}
