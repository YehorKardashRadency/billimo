
namespace Payments.Domain.Entities
{
    public class PaymentStatistic 
    {
        public long CompanyId { get; set; }

        public Company Company { get; set; }

        public TabType Tab { get; set; }

        public decimal Paid { get; set; }

        public decimal ForPayment { get; set; }
    }
}