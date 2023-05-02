using Invoicing.Application.Common.Mapping;
using Invoicing.Domain.Entities;

namespace Invoicing.Application.Invoicing.Queries
{
    public class BillPaymentDto : IMapFrom<Bill>
    {
        public long Id { get; set; }
        public string Status { get; set; }
        public string ApprovalStatus { get; set; }
        public long PaymentMethodId { get; set; }
        public InvoiceDto Invoice { get; set; }
        public CompanyDetailsDto Buyer { get; set; }
        public CompanyDetailsDto Seller { get; set; }
    }
}
