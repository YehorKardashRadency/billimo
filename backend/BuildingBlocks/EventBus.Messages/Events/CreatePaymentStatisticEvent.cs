namespace EventBus.Messages.Events
{
    public class CreatePaymentStatisticEvent : IntegrationBaseEvent
    {
        public long CompanyId { get; set; }
        public string CompanyName { get; set; }
    }
}
