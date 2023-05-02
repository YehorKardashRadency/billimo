using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Models;
using Administration.Domain.Entities;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Users.Commands
{
    public class FinishUserRegistrationCommand : IRequest<Result>
    {
        public long UserId { get; set; }
        public string OneTimePassword { get; set; }
        public string NewPassword { get; set; }
    }

    public class FinishUserRegistrationCommandValidator : AbstractValidator<FinishUserRegistrationCommand> {
        public FinishUserRegistrationCommandValidator()
        {
            RuleFor(x => x.NewPassword)
                .NotEmpty()
                .MinimumLength(8).WithMessage("Your password length must be at least 8.")
                .MaximumLength(32).WithMessage("Your password length must not exceed 32.")
                .Matches(@"[A-Z]+").WithMessage("Your password must contain at least one uppercase letter.")
                .Matches(@"[a-z]+").WithMessage("Your password must contain at least one lowercase letter.")
                .Matches(@"[0-9]+").WithMessage("Your password must contain at least one number.");
        }
    }

    public class FinishUserRegistrationCommandHandler : IRequestHandler<FinishUserRegistrationCommand, Result>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        public FinishUserRegistrationCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result> Handle(FinishUserRegistrationCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId) ?? throw new NotFoundException();

            var hasher = new PasswordHasher<User>();
            var verifyResult = hasher.VerifyHashedPassword(user, user.Password, request.OneTimePassword);
            
            if (verifyResult == PasswordVerificationResult.Failed) {
                return Result.Failure(new List<string> { "One time password is incorrect" });
            }

            user.Password = hasher.HashPassword(user, request.NewPassword);
            user.Invited = false;

            _context.Users.Update(user);
            
            var rows = await _context.SaveChangesAsync();

            return rows > 0 ? Result.Success() : Result.Failure(new List<string> { "User was not registered" });
        }
    }
}
