using Administration.Domain.Common;

namespace Administration.Domain.Entities;
public class TwoFactorAuthCode: BaseEntity
{
    public string Code { get; set; }
    public DateTime ExpirationDate { get; set; }
    public bool Disabled { get; set; } = false;

    public long UserId { get; set; }
    public User User { get; set; }
}
