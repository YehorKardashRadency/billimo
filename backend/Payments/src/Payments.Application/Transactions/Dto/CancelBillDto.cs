namespace Payments.Application.Transactions.Dto;
public class CancelBillDto
{
    public long BillId { get; set; }
    public long? CompanyId { get; set; }
    public string CancellationReason { get; set; }
}
