using Administration.Domain.Common;
using Administration.Domain.Entities;

namespace Administration.Application.Common.Models.Identity;
public class RefreshToken : BaseEntity
{
    public long UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public string JwtId { get; set; } = string.Empty;
    public bool IsUsed { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime AddedDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public User User { get; set; } = null!;
}
