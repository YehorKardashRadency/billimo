namespace EventBus.Messages.Events;

public class NotificationEvent
{
    public IEnumerable<string> Emails { get; set; }
    public string Message { get; set; }
}
