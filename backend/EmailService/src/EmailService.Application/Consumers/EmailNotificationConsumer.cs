using AutoMapper;
using EmailService.Application.Common.Interfaces;
using EmailService.Application.Email.Commands;
using EmailService.RazorHtmlEmails.Services;
using EventBus.Messages.Events;
using MassTransit;
using MediatR;

namespace EmailService.Application.Consumers;

public class EmailNotificationConsumer: IConsumer<NotificationEvent>
{
    private readonly ISender _sender;
    private readonly IEmailSender _emailSender;
    private readonly IMapper _mapper;
    private readonly IRazorViewToStringRenderer _razorViewToStringRenderer;

    public  EmailNotificationConsumer(ISender sender, IEmailSender emailSender, IMapper mapper, IRazorViewToStringRenderer razorViewToStringRenderer)
    {
        _sender = sender;
        _emailSender = emailSender;
        _mapper = mapper;
        _razorViewToStringRenderer = razorViewToStringRenderer;
    }

    public async Task Consume(ConsumeContext<NotificationEvent> context)
    {
        await _sender.Send(new SendNotificationCommand(context.Message));
    }
}
