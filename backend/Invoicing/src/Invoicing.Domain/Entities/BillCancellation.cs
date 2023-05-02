using Invoicing.Domain.Common;

namespace Invoicing.Domain.Entities;
public class BillCancellation: BaseEntity
{
    public long BillId { get; set; }
    public Bill Bill { get; set; }

    public long CompanyId { get; set; }
    public Company Company { get; set; }

    public DateTime CancellationTime { get; set; } = DateTime.UtcNow;
    public string Reason { get; set; }
}
