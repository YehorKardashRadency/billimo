using EventBus.Messages.Events;
using Invoicing.Application.Company.Commands.UpdateCompanyInfo;
using Invoicing.Application.Invoicing.Commands.UpdateBuyerInvoices;
using MassTransit;
using MediatR;

namespace Invoicing.Application.Consumers
{
    public class UpdateCompanyInfoConsumer : IConsumer<UpdateCompanyInfoEvent>
    {
        private readonly ISender _sender;
        public UpdateCompanyInfoConsumer(ISender sender)
        {
            _sender = sender;
        }

        public async Task Consume(ConsumeContext<UpdateCompanyInfoEvent> context)
        {
            await _sender.Send(new UpdateCompanyInfoCommand(context.Message));
        }
    }
}
