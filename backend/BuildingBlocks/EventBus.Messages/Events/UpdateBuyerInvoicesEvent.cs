namespace EventBus.Messages.Events
{
    public class UpdateBuyerInvoicesEvent : IntegrationBaseEvent
    {
        public long BillId { get; set; }    
        public long BuyerId { get; set; }
        public string BuyerName { get; set; }
    }
}
