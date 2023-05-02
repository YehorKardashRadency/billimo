using Payments.Application.Common.Models;

namespace Payments.Application.InvoiceApi;
public class BillPaymentDto
{
    public long Id { get; set; }

    public string Status { get; set; }

    public long PaymentMethodId { get; set; }
    public InvoiceDto Invoice { get; set; }
}
