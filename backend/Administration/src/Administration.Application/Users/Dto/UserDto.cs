using Administration.Domain.Entities;

namespace Administration.Application.Users.Dto;
public class UserDto
{
    public long? Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public Role Role { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public long CompanyId { get; set; }
    public string? Avatar { get; set; }
}
