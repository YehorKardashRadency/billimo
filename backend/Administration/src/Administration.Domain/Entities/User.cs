using Administration.Domain.Common;

namespace Administration.Domain.Entities
{
    public class User : BaseEntity
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public Role Role { get; set; }
        public long CompanyId { get; set; }

        public byte[]? Avatar { get; set; }
        public bool NotificationsEnabled { get; set; } = true;
        public bool TwoFactorEnabled { get; set; } = false;

        public int TwoFactorFailedAttempts { get; set; }
        public DateTime? TwoFactorLastFailedAttempt { get; set; }
        public bool Invited { get; set; } = false;
        public Company Company { get; set; }
        public ICollection<LoginAttempt> LoginAttempts { get; set; }
        public ICollection<TwoFactorAuthCode> TwoFactorAuthCodes { get; set; }
    }
}
