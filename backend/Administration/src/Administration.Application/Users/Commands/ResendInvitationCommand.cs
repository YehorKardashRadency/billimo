using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Models;
using Administration.Domain.Entities;
using AutoMapper;
using EventBus.Messages.Events;
using MassTransit;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Users.Commands;

public readonly record struct ResendEmployeeInvitation(long EmployeeId)
    : IRequest<Result>;


public class ResendEmployeeInvitationCommandHandler : IRequestHandler<ResendEmployeeInvitation, Result>
{

    private readonly IApplicationDbContext _context;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IMapper _mapper;

    public ResendEmployeeInvitationCommandHandler(IMapper mapper, IApplicationDbContext context, IPublishEndpoint publishEndpoint)
    {
        _mapper = mapper;
        _context = context;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<Result> Handle(ResendEmployeeInvitation request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == request.EmployeeId) ?? throw new NotFoundException();

        var oneTimePwd = GeneratePassword();
        var hasher = new PasswordHasher<User>();
        user.Password = hasher.HashPassword(user, oneTimePwd)!;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        
        var eventMessage = new UserRegistrationEvent {
            UserId = user.Id,
            UserName = user.FirstName,
            Email = user.Email,
            Subject = "Billimo Invitation",
            OneTimePassword = oneTimePwd
        };
        await _publishEndpoint.Publish(eventMessage);

        return Result.Success();
    }

    private string GeneratePassword()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray()).Substring(0, 12);
    }
}
