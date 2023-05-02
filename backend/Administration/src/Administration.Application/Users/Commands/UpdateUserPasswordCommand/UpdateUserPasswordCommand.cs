using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Models;
using Administration.Application.Common.Models.Identity;
using Administration.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Users.Commands.UpdateUserPasswordCommand;
public class UpdateUserPasswordCommand: IRequest<Result>
{
    public UpdateUserPasswordDto PasswordDto { get; set; }
}

public class UpdateUserPasswordCommandHandler : IRequestHandler<UpdateUserPasswordCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _userService;

    public UpdateUserPasswordCommandHandler(IApplicationDbContext context, ICurrentUserService userService)
    {
        _context = context;
        _userService = userService;
    }

    public async Task<Result> Handle(UpdateUserPasswordCommand request, CancellationToken cancellationToken)
    {
        var passwordSettings = request.PasswordDto;
        var userId = _userService.Id;
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId)
            ?? throw new NotFoundException();

        var hasher = new PasswordHasher<User>();
        var verifyResult = hasher.VerifyHashedPassword(user, user.Password, passwordSettings.OldPassword);
        if (verifyResult == PasswordVerificationResult.Failed)
            return new Result(false, new string[] { "Wrong Password" });

        user.Password = hasher.HashPassword(user, passwordSettings.NewPassword);
        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return new Result(true, new string[] { });
    }
}
