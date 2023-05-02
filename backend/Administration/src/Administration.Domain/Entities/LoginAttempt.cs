using Administration.Domain.Common;

namespace Administration.Domain.Entities
{
    public class LoginAttempt : BaseEntity
    {
        public User User { get; set; }
        public long UserId { get; set; }
        public DateTime Time { get; set; }
    }
}