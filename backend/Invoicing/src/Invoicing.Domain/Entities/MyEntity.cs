using Invoicing.Domain.Common;

namespace Invoicing.Domain.Entities;

public class MyEntity : BaseEntity
{
    public string Prop { get; set; } = "test";
}