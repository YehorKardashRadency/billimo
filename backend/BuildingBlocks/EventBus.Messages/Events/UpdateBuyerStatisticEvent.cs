namespace EventBus.Messages.Events
{
    public class UpdateBuyerStatisticEvent : IntegrationBaseEvent
    {
        public long BuyerId { get; set; }
        public decimal ForPayment { get; set; }
    }
}
