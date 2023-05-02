using Administration.Application.Common.Models;
using MediatR;

namespace Administration.Application.RegisterCompany.Commands;

public record ValidateRegistrationDataCommand(FirstStepDto DTO) : IRequest;

public class ValidateRegistrationDataHandler : IRequestHandler<ValidateRegistrationDataCommand>
{
    public Task<Unit> Handle(ValidateRegistrationDataCommand request, CancellationToken cancellationToken)
    {
        return Task.FromResult(Unit.Value);
    }
}