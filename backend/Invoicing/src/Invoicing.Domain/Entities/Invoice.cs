using Invoicing.Domain.Common;

namespace Invoicing.Domain.Entities
{
    public class Invoice : BaseEntity
    {
        public long Number { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime DueDate { get; set; }
        public string Notes { get; set; }
        public ICollection<InvoiceItem> Items { get; set; }
        public Currency Currency { get; set; }
        public Company? Buyer { get; set; }
        public long? BuyerId { get; set; }
        public string? BuyerEmail { get; set; }
        public Company Seller { get; set; }
        public long SellerId { get; set; }
        public decimal Total { get; set; }
        public InvoiceType Type { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }

        public InvoicePaymentStatus PaymentStatus { get; set; } = InvoicePaymentStatus.InProgress;
        public bool IsRegular { get; set; }
        public DateTime? RegularInvoiceDate { get; set; }
        public byte[]? TemplatePreview { get; set; }
    }
}