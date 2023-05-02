namespace Administration.Application.Common.Interfaces;

public interface IEmailNotificationsSender
{
    public Task SendEmails(IEnumerable<string> emails, string message, CancellationToken cancellationToken);
}