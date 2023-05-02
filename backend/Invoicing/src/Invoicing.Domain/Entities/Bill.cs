using Invoicing.Domain.Common;

namespace Invoicing.Domain.Entities
{
    public class Bill : BaseEntity
    {
        public Invoice Invoice { get; set; }
        public long InvoiceId { get; set; }
        public long PaymentMethodId { get; set; }
        public BillStatus Status { get; set; }
        public Guid BillSecureUrl { get; set; } = Guid.NewGuid();
        public ApprovalStatus ApprovalStatus { get; set; }
        
        public long? BillCancellationId { get; set; }
        public BillCancellation BillCancellation { get; set; }
    }
}