using AutoMapper;
using EmailService.Application.Common.Interfaces;
using EmailService.Application.Common.Models;
using EmailService.Application.Email.Dto;
using EmailService.RazorHtmlEmails.Services;
using EmailService.RazorHtmlEmails.Views.Emails.Bill;
using EmailService.RazorHtmlEmails.Views.Emails.Invite;
using EventBus.Messages.Events;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace EmailService.Application.Email.Commands;

public record SendBillEmailCommand(BillEmail BillEmail) : IRequest<Result>;


public class SendBillEmailCommandHandler : IRequestHandler<SendBillEmailCommand, Result>
{
    private readonly IMapper _mapper;
    private readonly IEmailSender _emailService;
    private readonly IRazorViewToStringRenderer _razorViewToStringRenderer;
    private readonly IConfiguration _config;

    public SendBillEmailCommandHandler(IMapper mapper, IEmailSender emailService,
        IRazorViewToStringRenderer razorViewToStringRenderer, IConfiguration config)
    {
        _mapper = mapper;
        _emailService = emailService;
        _razorViewToStringRenderer = razorViewToStringRenderer;
        _config = config;
    }

    public async Task<Result> Handle(SendBillEmailCommand request, CancellationToken cancellationToken)
    {
        var email = new SendEmailDto();
        var link = _config["BillsPreviewUrl"] + request.BillEmail.BillId;
        var currency = (Currency)request.BillEmail.Currency switch
        {
            Currency.EUR => "€",
            Currency.UAN => "₴",
            Currency.USD => "$",
            _ => "???",
        };
        var total = $"{currency}{request.BillEmail.Total}";
        var invitationViewModel = new BillEmailViewModel(link,request.BillEmail.CompanySenderName,total, GeneratePassword());
        email.HtmlContent = await _razorViewToStringRenderer.RenderViewToStringAsync(
            "/Views/Emails/Bill/BillEmail.cshtml",
            invitationViewModel);
        email.Subject = "Billimo Invoice";
        email.ReceiverEmail = request.BillEmail.CompanyReceiverEmail;
        email.ReceiverName = "User";
        return await _emailService.SendAsync(email, cancellationToken);
    }

    private string GeneratePassword()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray()).Substring(0, 12);
    }
}
