using AutoMapper;
using EmailService.Application.Email.Commands;
using EmailService.Application.Email.Dto;
using EventBus.Messages.Events;
using MassTransit;
using MediatR;

namespace EmailService.Application.Consumers
{
    public class UserRegistrationConsumer : IConsumer<UserRegistrationEvent>
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;

        public UserRegistrationConsumer(ISender sender, IMapper mapper)
        {
            _sender = sender;
            _mapper = mapper;
        }

        public async Task Consume(ConsumeContext<UserRegistrationEvent> context)
        {
            await _sender.Send(new SendInvitationEmailCommand(context.Message));
        }
    }
}
