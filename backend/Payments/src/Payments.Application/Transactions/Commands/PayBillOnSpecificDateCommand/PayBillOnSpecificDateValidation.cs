using FluentValidation;

namespace Payments.Application.Transactions.Commands.PayBillOnSpecificDateCommand;

public class PayBillOnSpecificDateValidation : AbstractValidator<PayBillOnSpecificDateCommand>
{
    public PayBillOnSpecificDateValidation()
    {
        RuleFor(x => x.PayBillDto.PayDate).NotNull();
    }
}
