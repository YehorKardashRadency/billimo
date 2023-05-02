using AutoMapper;
using EmailService.Application.Common.Interfaces;
using EmailService.Application.Common.Models;
using EmailService.Application.Email.Dto;
using EmailService.RazorHtmlEmails.Services;
using EmailService.RazorHtmlEmails.Views.Emails.Auth;
using EmailService.RazorHtmlEmails.Views.Emails.Bill;
using EventBus.Messages.Events;
using MediatR;

namespace EmailService.Application.Email.Commands
{
    public class SendTwoFactorAuthCodeCommand : IRequest<Result>
    {
        public SendTwoFactorAuthCodeEvent Event { get; set; }
    }

    public class SendTwoFactorAuthCodeCommandHandler: IRequestHandler<SendTwoFactorAuthCodeCommand, Result>
    {
        private readonly IMapper _mapper;
        private readonly IEmailSender _emailService;
        private readonly IRazorViewToStringRenderer _razorViewToStringRenderer;

        public SendTwoFactorAuthCodeCommandHandler(IMapper mapper, IEmailSender emailService,
            IRazorViewToStringRenderer razorViewToStringRenderer)
        {
            _mapper = mapper;
            _emailService = emailService;
            _razorViewToStringRenderer = razorViewToStringRenderer;
        }

        public async Task<Result> Handle(SendTwoFactorAuthCodeCommand request, CancellationToken cancellationToken)
        {
            var email = new SendEmailDto();
            var model = new TwoFactorAuthCodeViewModel() { Code = request.Event.Code };

            email.HtmlContent = await _razorViewToStringRenderer.RenderViewToStringAsync(
                "/Views/Emails/Auth/SendTwoFactorAuthCode.cshtml",
                model);

            email.Subject = "Billimo Auth Code";
            email.ReceiverEmail = request.Event.Email;
            email.ReceiverName = "User";

            return await _emailService.SendAsync(email, cancellationToken);
        }
    }
}
