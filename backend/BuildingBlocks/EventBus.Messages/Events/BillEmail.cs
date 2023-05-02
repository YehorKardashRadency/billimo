namespace EventBus.Messages.Events;

public class BillEmail
{
    public long BillId { get; set; }
    public long CompanySenderId { get; set; }
    public string CompanySenderName { get; set; }
    public string CompanyReceiverEmail { get; set; }
    public decimal Total { get; set; }
    public int Currency { get; set; }
    public string BillSecureUrl { get; set; }
}
