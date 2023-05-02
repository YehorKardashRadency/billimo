using AutoMapper;
using EmailService.Application.Common.Interfaces;
using EmailService.Application.Email.Commands;
using EmailService.Application.Email.Dto;
using EmailService.RazorHtmlEmails.Services;
using EventBus.Messages.Events;
using MassTransit;
using MediatR;

namespace EmailService.Application.Consumers
{
    public class SendTwoFactorAuthCodeConsumer : IConsumer<SendTwoFactorAuthCodeEvent>
    {
        private readonly ISender _sender;
        private readonly IEmailSender _emailSender;
        private readonly IMapper _mapper;
        private readonly IRazorViewToStringRenderer _razorViewToStringRenderer;

        public SendTwoFactorAuthCodeConsumer(ISender sender, IRazorViewToStringRenderer razorViewToStringRenderer,
            IEmailSender emailSender, IMapper mapper)
        {
            _sender = sender;
            _razorViewToStringRenderer = razorViewToStringRenderer;
            _emailSender = emailSender;
            _mapper = mapper;
        }

        public async Task Consume(ConsumeContext<SendTwoFactorAuthCodeEvent> context)
        {
            await _sender.Send(new SendTwoFactorAuthCodeCommand { Event = context.Message });
        }
    }
}
