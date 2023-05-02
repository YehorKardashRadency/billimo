using Administration.Application.Common.Interfaces;
using Administration.Domain.Common;
using FluentValidation;

namespace Administration.Application.RegisterCompany.Commands;

public class FirstStepDTOValidator : AbstractValidator<FirstStepDto>
{
    private readonly IApplicationDbContext _context;
    public FirstStepDTOValidator(IApplicationDbContext context)
    {
        _context = context;
        RuleFor(dto => dto.Email)
            .EmailAddress()
            .Must(newEmail =>!_context.Users
                .Select(u=>u.Email.ToLower())
                .Any(email=>email==newEmail.ToLower()))
            .WithMessage("This email is already taken");
        RuleFor(dto => dto.CompanyName)
            .Length(3,75)
            .Must(newCompanyName =>!_context.Companies
                .Select(c=>c.Name.ToLower())
                .Any(companyName=>companyName == newCompanyName))
            .WithMessage("This company name is already taken");
        RuleFor(dto => dto.FirstName).Length(1,75);
        RuleFor(dto => dto.LastName).Length(1,75);
        RuleFor(dto => dto.Password)
            .NotEmpty()
            .MinimumLength(8).WithMessage("Your password length must be at least 8.")
            .MaximumLength(32).WithMessage("Your password length must not exceed 32.")
            .Matches(@"[A-Z]+").WithMessage("Your password must contain at least one uppercase letter.")
            .Matches(@"[a-z]+").WithMessage("Your password must contain at least one lowercase letter.")
            .Matches(@"[0-9]+").WithMessage("Your password must contain at least one number.");
    }
    
}

public class FirstStepValidator : AbstractValidator<ValidateRegistrationDataCommand>
{
    private readonly IApplicationDbContext _context;
    public FirstStepValidator(IApplicationDbContext context)
    {
        _context = context;
        RuleFor(c => c.DTO).SetValidator(new FirstStepDTOValidator(_context));
    }
}
public class ThirdStepValidator : AbstractValidator<RegisterCommand>
{
    private readonly IApplicationDbContext _context;
    public ThirdStepValidator(IApplicationDbContext context)
    {
        _context = context;
        RuleFor(c => c.DTO.Address.City).NotEmpty();
        RuleFor(c => c.DTO.Address.Country)
            .NotEmpty()
            .Must(country => Countries.Options.Contains(country))
            .WithMessage("Country is wrong or empty");
        RuleFor(c => c.DTO.Address.Street).NotEmpty().Length(5, 85);
        RuleFor(c => c.DTO.Address.ZipCode).NotEmpty().Length(2, 10);
        RuleFor(c => c.DTO.Address.Apartment)
            .Length(2, 25)
            .When(c=>!string.IsNullOrEmpty(c.DTO.Address.Apartment));
        RuleFor(c => c.DTO.CompanyData).SetValidator(new FirstStepDTOValidator(_context));
    }
}
