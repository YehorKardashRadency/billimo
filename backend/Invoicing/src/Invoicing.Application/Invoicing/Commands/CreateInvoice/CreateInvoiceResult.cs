using Invoicing.Application.Common.Mapping;
using Invoicing.Domain.Entities;

namespace Invoicing.Application.Invoicing.Commands.CreateInvoice;

public class CreateInvoiceResult: IMapFrom<Invoice>
{
    public long Id { get; set; } 
    public int ApprovalStatus { get; set; }
};