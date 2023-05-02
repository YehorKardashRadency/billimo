using EventBus.Messages.Events;
using MassTransit;
using MediatR;
using Payments.Application.BillPayment.Commands;

namespace Payments.Application.Consumers;
public class CreatePaymentStatisticConsumer : IConsumer<CreatePaymentStatisticEvent>
{
    private readonly ISender _sender;
    public CreatePaymentStatisticConsumer(ISender sender)
    {
        _sender = sender;
    }

    public async Task Consume(ConsumeContext<CreatePaymentStatisticEvent> context)
    {
        await _sender.Send(new CreatePaymentStatisticCommand(context.Message));
    }
}
