using AutoMapper;
using EmailService.Application.Common.Interfaces;
using EmailService.Application.Email.Commands;
using EmailService.RazorHtmlEmails.Services;
using EventBus.Messages.Events;
using MassTransit;
using MediatR;

namespace EmailService.Application.Consumers;

public class BillEmailConsumer : IConsumer<BillEmail>
{
    private readonly ISender _sender;
    private readonly IEmailSender _emailSender;
    private readonly IMapper _mapper;
    private readonly IRazorViewToStringRenderer _razorViewToStringRenderer;

    public BillEmailConsumer(ISender sender, IEmailSender emailSender, IMapper mapper, IRazorViewToStringRenderer razorViewToStringRenderer)
    {
        _sender = sender;
        _emailSender = emailSender;
        _mapper = mapper;
        _razorViewToStringRenderer = razorViewToStringRenderer;
    }

    public async Task Consume(ConsumeContext<BillEmail> context)
    {
        await _sender.Send(new SendBillEmailCommand(context.Message));
    }
}
