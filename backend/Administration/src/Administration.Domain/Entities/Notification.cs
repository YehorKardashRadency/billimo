using Administration.Domain.Common;

namespace Administration.Domain.Entities
{
    public class Notification : BaseEntity
    {
        public long CompanyId { get; set; }

        // use this field to target whatever entity you need
        public long? ReferenceId { get; set; }

        public NotificationOperation Operation { get; set; }

        public string Message { get; set; } = null!;
        public string MessageWithoutLinks { get; set; } = null!;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public Company Company { get; set; } = null!;
    }
}