using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Models;
using Administration.Domain.Entities;
using AutoMapper;
using EventBus.Messages.Events;
using FluentValidation;
using MassTransit;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Administration.Application.Users.Commands
{
    public class RegisterUserCommand : IRequest<Result>
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Role { get; set; }
    }

    public class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand> {
        private readonly IApplicationDbContext _context;
        public RegisterUserCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Email)
                .EmailAddress()
                .Must(newEmail => !_context.Users
                    .Select(u => u.Email.ToLower())
                    .Any(email => email == newEmail.ToLower()))
                .WithMessage("This email is already taken");
            RuleFor(x => x.FirstName).Length(1,75);
            RuleFor(x => x.LastName).Length(1,75);
        }
    }

    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Result>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IPublishEndpoint _publishEndpoint;
        private readonly ICurrentUserService _currentUserService;

        public RegisterUserCommandHandler(IApplicationDbContext context, IMapper mapper, IPublishEndpoint publishEndpoint,
            ICurrentUserService currentUserService)
        {
            _context = context;
            _mapper = mapper;
            _publishEndpoint = publishEndpoint;
            _currentUserService = currentUserService;
        }

        public async Task<Result> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            var oneTimePwd = GeneratePassword();
            var user = new User {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Role = (Role)request.Role,
                CompanyId = _currentUserService.Companyid,
                Invited = true
            };

            var hasher = new PasswordHasher<User>();
            user.Password = hasher.HashPassword(user, oneTimePwd)!;

            await _context.Users.AddAsync(user);
            
            var rows = await _context.SaveChangesAsync();

            var eventMessage = new UserRegistrationEvent {
                UserId = user.Id,
                UserName = request.FirstName,
                Email = request.Email,
                Subject = "Billimo Invitation",
                OneTimePassword = oneTimePwd
            };
            await _publishEndpoint.Publish(eventMessage);

            return rows > 0 ? Result.Success() : Result.Failure(new List<string> { "User was not registered" });
        }
        private string GeneratePassword()
        {
            return Convert.ToBase64String(Guid.NewGuid().ToByteArray()).Substring(0, 12);
        }
    }
}
