using Invoicing.Application.Common.Mapping;
using Invoicing.Domain.Entities;

namespace Invoicing.Application.Common.Models;

public class InvoiceDto : IMapFrom<Invoice>
{
    public long Id { get; set; }
    public string Number { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime DueDate { get; set; }
    public string Notes { get; set; }
    public ICollection<InvoiceItemDto> Items { get; set; }
    public Currency Currency { get; set; }
    public CompanyModel? Company { get; set; }
    public long? BuyerId { get; set; }
    public long SellerId { get; set; }
    public decimal Total { get; set; }
    public bool IsTemplate { get; set; }
    public bool IsArchived { get; set; }
    public bool IsRegular { get; set; }
    public DateTime? RegularInvoiceDate { get; set; }
}
