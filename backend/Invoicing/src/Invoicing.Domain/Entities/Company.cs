using Invoicing.Domain.Common;

namespace Invoicing.Domain.Entities;
public class Company : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public long RefId { get; set;}
}
