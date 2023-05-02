using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Companies.Dto;
using Administration.Domain.Entities;
using AutoMapper;
using EventBus.Messages.Events;
using MassTransit;
using MediatR;

namespace Administration.Application.Companies.Commands;

public record AddNotificationCommand(NotificationDto NotificationDto): IRequest;

public class AddNotificationCommandHandler: IRequestHandler<AddNotificationCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IEmailNotificationsSender _emailNotificationsSender;
    public AddNotificationCommandHandler(IApplicationDbContext context, IMapper mapper, IEmailNotificationsSender emailNotificationsSender)
    {
        _context = context;
        _mapper = mapper;
        _emailNotificationsSender = emailNotificationsSender;
    }

    public async Task<Unit> Handle(AddNotificationCommand request, CancellationToken cancellationToken)
    {
        if (request.NotificationDto.Message == null && request.NotificationDto.MessageWithoutLinks == null)
        {
            throw new BadRequestException();
        }
        request.NotificationDto.MessageWithoutLinks ??= request.NotificationDto.Message;
        request.NotificationDto.Message ??= request.NotificationDto.MessageWithoutLinks;
        
        var notification = _mapper.Map<Notification>(request.NotificationDto);
        notification.CreatedDate = DateTime.UtcNow;
        
        var company = await _context.Companies.FindAsync(notification.CompanyId);
        if (company == null)
            throw new BadRequestException("Wrong company ID");
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync(cancellationToken);
        var emails = _context.Users
            .Where(u => u.NotificationsEnabled && u.CompanyId == notification.CompanyId)
            .Select(u=>u.Email);
        await _emailNotificationsSender.SendEmails(emails,notification.MessageWithoutLinks,cancellationToken);
        return Unit.Value;
    }
}