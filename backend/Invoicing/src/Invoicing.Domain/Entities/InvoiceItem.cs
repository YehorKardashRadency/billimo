using Invoicing.Domain.Common;

namespace Invoicing.Domain.Entities
{
    public class InvoiceItem : BaseEntity
    {
        public string Description { get; set; }
        public Metric Metric { get; set; }
        public int Count { get; set; }
        public decimal Price { get; set; }
        public Invoice Invoice { get; set; }
        public long InvoiceId { get; set; }
        public decimal Subtotal { get; set; }
    }
}