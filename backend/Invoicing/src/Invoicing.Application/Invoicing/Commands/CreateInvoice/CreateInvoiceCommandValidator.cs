using FluentValidation;
using Invoicing.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Application.Invoicing.Commands.CreateInvoice;

public class CreateInvoiceCommandValidator : AbstractValidator<CreateInvoiceCommand>
{
    private readonly IApplicationDbContext _context;

    public CreateInvoiceCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(i => i.Number)
            .NotEmpty().WithMessage("Number is required.")
            .MustAsync(BeUniqueNumber).WithMessage("The specified number already exists.")
            .Unless((x) => x.Id is not null);
        RuleFor(c => c.BuyerEmail)
            .NotEmpty()
            .NotNull()
            .EmailAddress()
            .When(c => c.BuyerId == null);
        RuleFor(c => c.BuyerId)
            .NotNull()
            .When(c => c.BuyerEmail == null);
    }

    public async Task<bool> BeUniqueNumber(long number, CancellationToken cancellationToken)
    {
        return await _context.Invoices
            .AllAsync(l => l.Number != number);
    }
}