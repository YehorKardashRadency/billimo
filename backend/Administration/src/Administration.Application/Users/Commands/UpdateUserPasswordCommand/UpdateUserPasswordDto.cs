namespace Administration.Application.Users.Commands.UpdateUserPasswordCommand;
public class UpdateUserPasswordDto
{
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
}
