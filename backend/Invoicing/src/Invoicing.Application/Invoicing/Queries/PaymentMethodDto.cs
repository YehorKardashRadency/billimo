namespace Invoicing.Application.Invoicing.Queries
{
    public class PaymentMethodDto
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string? Additional { get; set; }
        public string BankAccountToken { get; set; }
        public string MethodType { get; set; }
    }
}