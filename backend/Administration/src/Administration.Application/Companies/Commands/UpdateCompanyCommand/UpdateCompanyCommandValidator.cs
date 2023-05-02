using Administration.Application.Common.Interfaces;
using FluentValidation;

namespace Administration.Application.Companies.Commands.UpdateCompanyCommand;

public class UpdateCompanyCommandValidator : AbstractValidator<UpdateCompanyCommand>
{
    public UpdateCompanyCommandValidator(IThumbnailService thumbnailService)
    {
        RuleFor(x => thumbnailService.GetOriginalLengthInBytes(x.Documents.Logo))
            .LessThanOrEqualTo(2 * 1048576);
        RuleFor(x => x.Documents.Email).EmailAddress();
    }
}