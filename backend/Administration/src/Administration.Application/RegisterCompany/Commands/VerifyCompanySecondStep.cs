using Administration.Application.Common.Models;
using MediatR;

namespace Administration.Application.RegisterCompany.Commands;

public record VerifyCompanyCommand() : IRequest<IdResponse>;

public class VerifyCompanyHandler : IRequestHandler<VerifyCompanyCommand,IdResponse>
{
    public async Task<IdResponse> Handle(VerifyCompanyCommand request, CancellationToken cancellationToken)
    {
        return new IdResponse() {Id = 0};
    }
}