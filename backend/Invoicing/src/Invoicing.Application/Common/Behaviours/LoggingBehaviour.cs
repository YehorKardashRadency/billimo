using Invoicing.Application.Common.Interfaces;
using MediatR;
using MediatR.Pipeline;
using Microsoft.Extensions.Logging;

namespace Invoicing.Application.Common.Behaviours;

public class LoggingBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger _logger;
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTime dateTime;

    public LoggingBehaviour(ILogger<TRequest> logger, ICurrentUserService currentUserService, IDateTime dateTime)
    {
        _logger = logger;
        _currentUserService = currentUserService;
        this.dateTime = dateTime;
    }

    public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
    {
        var requestName = typeof(TRequest).Name;
        var name = _currentUserService.Name ?? string.Empty;
        string userName = string.Empty;

        _logger.LogInformation("Invoicing Request: {@Name} {@Request} at {@DateTime}",
            name, request, dateTime.Now);

        return await next();
    }
}
