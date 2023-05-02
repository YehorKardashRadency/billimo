using Administration.Application.Companies.Dto;
using Administration.Application.Notifications.Commands;
using AutoMapper;
using EventBus.Messages.Events;
using MassTransit;
using MediatR;

namespace Administration.Application.Consumers;

public class BillNotificationConsumer : IConsumer<BillNotificationEvent>
{
    private readonly ISender _sender;
    private readonly IMapper _mappper;
    public BillNotificationConsumer(ISender sender, IMapper mappper)
    {
        _sender = sender;
        _mappper = mappper;
    }

    public async Task Consume(ConsumeContext<BillNotificationEvent> context)
    {
        await _sender.Send(new CreateBillNotificationCommand(context.Message));
    }
}