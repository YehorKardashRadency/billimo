namespace Administration.Application.Common.Models.Identity;
public class UserMock
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public int Company_id { get; set; }
}