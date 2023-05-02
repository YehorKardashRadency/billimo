namespace EventBus.Messages.Events;

public class BillNotificationEvent : IntegrationBaseEvent
{
    public long CompanySenderId { get; set; }
    public long CompanyReceiverId { get; set; }
    public decimal Total { get; set; }
    public int Currency { get; set; }
}
