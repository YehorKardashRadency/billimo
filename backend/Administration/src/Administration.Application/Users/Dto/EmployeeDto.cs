using Administration.Domain.Entities;

namespace Administration.Application.Users.Dto;
public class EmployeeDto 
{
    public long Id { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public Role Role { get; set; }
    public bool Invited { get; set; }
}
