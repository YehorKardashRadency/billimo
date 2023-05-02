using Administration.Application.Common.Interfaces;
using EventBus.Messages.Events;
using MassTransit;

namespace Administration.Infrastructure.Services;

public class EmailNotificationsSender : IEmailNotificationsSender
{ 
    private readonly IPublishEndpoint _publishEndpoint;

    public EmailNotificationsSender(IPublishEndpoint publishEndpoint)
    {
        _publishEndpoint = publishEndpoint;
    }

    public async Task SendEmails(IEnumerable<string> emails, string message,CancellationToken cancellationToken)
    {
        var emailsList = emails.ToList();
        if(!emailsList.Any()) return;
        await _publishEndpoint.Publish(
            new NotificationEvent() {Emails = emailsList, Message = message}, 
            cancellationToken);
    }
}