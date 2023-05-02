using Administration.Domain.Common;

namespace Administration.Domain.Entities
{
    public class PendingAction : BaseEntity
    {
        public PendingActionType Type { get; set; }
        public Company Company { get; set; }
        public long CompanyId { get; set; }
    }
}