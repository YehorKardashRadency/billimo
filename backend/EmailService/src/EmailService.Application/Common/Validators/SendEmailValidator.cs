using EmailService.Application.Email.Dto;
using FluentValidation;

namespace EmailService.Application.Common.Validators;

public class SendEmailValidator : AbstractValidator<SendEmailDto>
{
    public SendEmailValidator()
    {
        RuleFor(x => x.ReceiverEmail)
            .NotEmpty()
            .WithMessage("Reveiver email should not be null or empty")
            .EmailAddress()
            .WithMessage("Invalid reveiver email format");

        RuleFor(x => x.ReceiverName)
            .NotEmpty()
            .WithMessage("Receiver name should not be null or empty");
    }
}
public class SendEmailValidatorMultiple : AbstractValidator<SendEmailDtoMultiple>
{
    public SendEmailValidatorMultiple()
    {
        RuleForEach(x => x.ReceiverEmails)
            .NotEmpty()
            .WithMessage("Reveiver email should not be null or empty")
            .EmailAddress()
            .WithMessage("Invalid reveiver email format");

        RuleFor(x => x.ReceiverName)
            .NotEmpty()
            .WithMessage("Receiver name should not be null or empty");
    }
}
