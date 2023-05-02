using EmailService.Application.Common.Models;
using EmailService.Application.Email.Dto;

namespace EmailService.Application.Common.Interfaces;

public interface IEmailSender
{
    Task<Result> SendAsync(string to, string content, string subject, CancellationToken cancellationToken = default);
    Task<Result> SendAsync(SendEmailDto dto, CancellationToken cancellationToken = default);
    Task<Result> SendAsyncMultiple(SendEmailDtoMultiple dto, CancellationToken cancellationToken = default);
}
