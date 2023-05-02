namespace Payments.Application.Common.Models;

public class InvoiceDto
{
    public long Id { get; set; }
    public string Number { get; set; }

    public long BuyerId { get; set; }
    public long SellerId { get; set; }
    public decimal Total { get; set; }
}