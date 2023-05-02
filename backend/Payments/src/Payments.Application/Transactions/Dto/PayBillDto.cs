namespace Payments.Application.Transactions.Dto;

public class PayBillDto
{
    public long BillId { get; set; }
    public long PaymentMethodId { get; set; }

    public DateTime? PayDate { get; set; }
    public int? SpreadDays { get; set; }
}