using FluentValidation;

namespace Administration.Application.Users.Commands.UpdateUserPasswordCommand;

public class UpdateUserPasswordValidation : AbstractValidator<UpdateUserPasswordCommand>
{
    public UpdateUserPasswordValidation()
    {
        RuleFor(x => x.PasswordDto.NewPassword)
            .NotEmpty().WithMessage("Password should not be empty")
            .Matches(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$")
            .WithMessage("Invalid password format");

        RuleFor(x => x.PasswordDto.OldPassword)
            .NotEmpty().WithMessage("Password should not be empty");
    }
}
