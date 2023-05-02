namespace EventBus.Messages.Events
{
    public class UpdatePaymentStatisticEvent : IntegrationBaseEvent
    {
        public long SellerId { get; set; }
        public long? BuyerId { get; set; }
        public decimal ForPayment { get; set; }
    }
}
