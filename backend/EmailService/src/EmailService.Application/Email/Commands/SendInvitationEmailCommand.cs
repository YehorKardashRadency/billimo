using AutoMapper;
using EmailService.Application.Common.Interfaces;
using EmailService.Application.Common.Models;
using MediatR;
using EmailService.RazorHtmlEmails.Services;
using EmailService.RazorHtmlEmails.Views.Emails.Invite;
using Microsoft.Extensions.Configuration;
using EventBus.Messages.Events;
using EmailService.Application.Email.Dto;

namespace EmailService.Application.Email.Commands
{
    public record SendInvitationEmailCommand(UserRegistrationEvent UserRegistrationEvent) : IRequest<Result>;

    public class SendInvitationEmailCommandHandler : IRequestHandler<SendInvitationEmailCommand, Result>
    {
        private readonly IMapper _mapper;
        private readonly IEmailSender _emailService;
        private readonly IRazorViewToStringRenderer _razorViewToStringRenderer;
        private readonly IConfiguration _config;

        public SendInvitationEmailCommandHandler(IMapper mapper, IEmailSender emailService, 
            IRazorViewToStringRenderer razorViewToStringRenderer, IConfiguration config)
        {
            _mapper = mapper;
            _emailService = emailService;
            _razorViewToStringRenderer = razorViewToStringRenderer;
            _config = config;
        }

        public async Task<Result> Handle(SendInvitationEmailCommand request, CancellationToken cancellationToken)
        {
            var userRegistrationEvent = request.UserRegistrationEvent;
            var invitationLink = _config["UserInvitationUrl"] + userRegistrationEvent.UserId;
            var invitationViewModel = new InvitationEmailViewModel(userRegistrationEvent.UserName!, 
                userRegistrationEvent.OneTimePassword!, invitationLink);
            var email = new SendEmailDto {
                HtmlContent = await _razorViewToStringRenderer
                    .RenderViewToStringAsync("/Views/Emails/Invite/InvitationEmail.cshtml", invitationViewModel),
                ReceiverEmail = userRegistrationEvent.Email,
                ReceiverName = userRegistrationEvent.UserName,
                Subject = userRegistrationEvent.Subject,
                ReceiverOneTimePassword = userRegistrationEvent.OneTimePassword
            };

            return await _emailService.SendAsync(email);
        }
    }
}
