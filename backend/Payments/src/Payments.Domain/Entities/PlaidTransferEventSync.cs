using Payments.Domain.Common;

namespace Payments.Domain.Entities;
public class PlaidTransfersEventSync : BaseEntity
{
    public int lastEventId { get; set; }
}
