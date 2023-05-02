using AutoMapper;
using EmailService.Application.Common.Interfaces;
using EmailService.Application.Common.Models;
using EmailService.Application.Email.Dto;
using EmailService.RazorHtmlEmails.Services;
using EmailService.RazorHtmlEmails.Views.Emails.Bill;
using EmailService.RazorHtmlEmails.Views.Emails.Notification;
using EventBus.Messages.Events;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace EmailService.Application.Email.Commands;

public record SendNotificationCommand(NotificationEvent NotificationEvent) : IRequest<Result>;

public class SendNotificationHandler : IRequestHandler<SendNotificationCommand, Result>
{
    private readonly IEmailSender _emailService;
    private readonly IRazorViewToStringRenderer _razorViewToStringRenderer;
    private readonly IConfiguration _config;
    public SendNotificationHandler(IEmailSender emailService, IRazorViewToStringRenderer razorViewToStringRenderer, IConfiguration config)
    {
        _emailService = emailService;
        _razorViewToStringRenderer = razorViewToStringRenderer;
        _config = config;
    }

    public async Task<Result> Handle(SendNotificationCommand request, CancellationToken cancellationToken)
    {
        if (request.NotificationEvent.Emails == null) return Result.Success();
        var email = new SendEmailDtoMultiple();
        var link = _config["BaseUrl"];
        var notificationViewModel = new NotificationEmailViewModel(request.NotificationEvent.Message,link);
        email.HtmlContent = await _razorViewToStringRenderer.RenderViewToStringAsync(
            "/Views/Emails/Notification/NotificationEmail.cshtml",
            notificationViewModel);
        email.Subject = "Billimo Notification";
        email.ReceiverEmails = request.NotificationEvent.Emails;
        email.ReceiverName = "User";
        return await _emailService.SendAsyncMultiple(email, cancellationToken);
    }
}
