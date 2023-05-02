namespace Invoicing.Application.Bills.Commands.MarkBillsAs;
public class MarkBillsDto
{
    public long[] Bills { get; set; }
    public string Status { get; set; }
}
