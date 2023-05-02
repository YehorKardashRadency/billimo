using EventBus.Messages.Events;
using Invoicing.Application.Invoicing.Commands.UpdateBuyerInvoices;
using MassTransit;
using MediatR;

namespace Invoicing.Application.Consumers
{
    public class UpdateBuyerInvoicesConsumer : IConsumer<UpdateBuyerInvoicesEvent>
    {
        private readonly ISender _sender;
        public UpdateBuyerInvoicesConsumer(ISender sender)
        {
            _sender = sender;
        }

        public async Task Consume(ConsumeContext<UpdateBuyerInvoicesEvent> context)
        {
            await _sender.Send(new UpdateBuyerInvoicesCommand(context.Message));
        }
    }
}
