using EmailService.Application.Common.Interfaces;
using EmailService.Application.Common.Models;
using EmailService.Application.Email.Dto;
using EmailService.Infrastructure.Settings;
using FluentValidation;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace EmailService.Infrastructure.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly SendEmailOptions _options;
        private readonly IValidator<SendEmailDto> _validator;
        private readonly IValidator<SendEmailDtoMultiple> _validatorMultiple;

        public EmailSender(IOptions<SendEmailOptions> settings, IValidator<SendEmailDto> validator,
            IValidator<SendEmailDtoMultiple> validatorMultiple)
        {
            if (string.IsNullOrEmpty(settings.Value.ApiKey)) throw new ArgumentNullException("settings.Value.ApiKey");
            _options = settings.Value;
            _validator = validator;
            _validatorMultiple = validatorMultiple;
        }

        public async Task<Result> SendAsync(string to, string content, string subject,
            CancellationToken cancellationToken = default)
        {
            return await SendAsync(new[] {to}, content, subject, cancellationToken);
        }

        public async Task<Result> SendAsync(IEnumerable<string> tos, string content, string subject,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var client = new SendGridClient(_options.ApiKey);

                var message = new SendGridMessage()
                {
                    From = new EmailAddress(_options.FromEmail, _options.FromName),
                    Subject = subject,
                    HtmlContent = content,
                };
                foreach (var to in tos)
                {
                    message.Personalizations = new()
                    {
                        new Personalization()
                        {
                            Tos = new List<EmailAddress>() {new EmailAddress(to)}
                        }
                    };
                    var response = await client.SendEmailAsync(message, cancellationToken);
                    if (!response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"Could not send email to {to}");
                    }
                }
                return Result.Success();
            }
            catch (ArgumentNullException ex)
            {
                return Result.Failure(new List<string> {ex.Message});
            }
        }

        public async Task<Result> SendAsync(SendEmailDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                await _validator.ValidateAndThrowAsync(dto, cancellationToken);
                return await SendAsync(dto.ReceiverEmail!, dto.HtmlContent!, dto.Subject!, cancellationToken);
            }
            catch (ValidationException ex)
            {
                return Result.Failure(ex.Errors.Select(x => x.ErrorMessage));
            }
        }

        public async Task<Result> SendAsyncMultiple(SendEmailDtoMultiple dto,
            CancellationToken cancellationToken = default)
        {
            try
            {
                await _validatorMultiple.ValidateAndThrowAsync(dto, cancellationToken);
                return await SendAsync(dto.ReceiverEmails!, dto.HtmlContent!, dto.Subject!, cancellationToken);
            }
            catch (ValidationException ex)
            {
                return Result.Failure(ex.Errors.Select(x => x.ErrorMessage));
            }
        }
    }
}
