using Invoicing.Application.Bills.Commands.MarkBillsAs;
using Payments.Application.InvoiceApi;
using Payments.Application.Transactions.Dto;
using RestEase;

namespace Payments.Application.Common.Interfaces;

public interface IInvoiceApi
{    
    [Get("/api/bill/{id}/retrieve")]
    Task<BillPaymentDto> GetBillById([Path] long id);

    [Put("/api/bill/markas")]
    Task MarkBillsAs([Body] MarkBillsDto bills);

    [Put("/api/bill/cancel")]
    Task CancelBill([Body] CancelBillDto billDto);
}