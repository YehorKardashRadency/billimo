using EventBus.Messages.Events;
using MassTransit;
using MediatR;
using Payments.Application.BillPayment.Commands;

namespace Payments.Application.Consumers;
public class UpdatePaymentStatisticConsumer : IConsumer<UpdatePaymentStatisticEvent>
{
    private readonly ISender _sender;
    public UpdatePaymentStatisticConsumer(ISender sender)
    {
        _sender = sender;
    }

    public async Task Consume(ConsumeContext<UpdatePaymentStatisticEvent> context)
    {
        await _sender.Send(new UpdatePaymentStatisticCommand(context.Message));
    }
}