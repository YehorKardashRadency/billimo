using EventBus.Messages.Events;
using MassTransit;
using MediatR;
using Payments.Application.BillPayment.Commands;

namespace Payments.Application.Consumers;
public class UpdateBuyerStatisticConsumer : IConsumer<UpdateBuyerStatisticEvent>
{
    private readonly ISender _sender;
    public UpdateBuyerStatisticConsumer(ISender sender)
    {
        _sender = sender;
    }

    public async Task Consume(ConsumeContext<UpdateBuyerStatisticEvent> context)
    {
        await _sender.Send(new UpdateBuyerStatisticCommand(context.Message));
    }
}
