using Administration.Application.Companies.Dto;
using Administration.Domain.Common;
using FluentValidation;

namespace Administration.Application.Companies.Commands;

public class AddressValidator : AbstractValidator<AddressDtoReq>
{
    public AddressValidator()
    {
        RuleFor(a => a.Title).NotEmpty().Length(3, 40);
        RuleFor(a => a.City).NotEmpty();
        RuleFor(a => a.Country)
            .NotEmpty()
            .Must(country => Countries.Options.Contains(country))
            .WithMessage("Country is wrong or empty");
        RuleFor(a => a.Street).NotEmpty().Length(5, 85);
        RuleFor(a => a.ZipCode).NotEmpty().Length(2, 10);
        RuleFor(a => a.Apartment)
            .Length(2, 25)
            .When(a=>!string.IsNullOrEmpty(a.Apartment));
    }
}

public class UpdateAddresValidator : AbstractValidator<UpdateAddressCommand>
{
    public UpdateAddresValidator()
    {
        RuleFor(c => c.Dto).SetValidator(new AddressValidator());
    }
}