using Administration.Application.Common.Interfaces;
using FluentValidation;

namespace Administration.Application.Users.Commands.UpdateUserProfileCommand;

public class UpdateUserProfileValidation : AbstractValidator<UpdateUserProfileCommand>
{
    public UpdateUserProfileValidation(IThumbnailService thumbnailService)
    {
        RuleFor(x => x.Profile.Name)
            .Matches(@"^[A-Za-z]+(?:\s[A-Za-z]+)+$")
            .WithMessage("Invalid name format");

        When(x => x.Profile.Avatar != null, () =>
        {
            RuleFor(x => thumbnailService.GetOriginalLengthInBytes(x.Profile.Avatar))
                .LessThanOrEqualTo(2 * 1048576);
        });
    }
}
