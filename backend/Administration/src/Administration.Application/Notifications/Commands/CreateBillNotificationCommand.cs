using System.Diagnostics;
using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Models;
using Administration.Domain.Common;
using Administration.Domain.Entities;
using EventBus.Messages.Events;
using MediatR;

namespace Administration.Application.Notifications.Commands;

public record CreateBillNotificationCommand(BillNotificationEvent NotificationEvent) : IRequest;

public class CreateBillNotificationCommandHandler : IRequestHandler<CreateBillNotificationCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IEmailNotificationsSender _emailNotificationsSender;
    public CreateBillNotificationCommandHandler(IApplicationDbContext context, IEmailNotificationsSender emailNotificationsSender)
    {
        _context = context;
        _emailNotificationsSender = emailNotificationsSender;
    }

    public async Task<Unit> Handle(CreateBillNotificationCommand request, CancellationToken cancellationToken)
    {
        var companySender = await _context.Companies.FindAsync(request.NotificationEvent.CompanySenderId);
        var companyReceiver = await _context.Companies.FindAsync(request.NotificationEvent.CompanyReceiverId);
        var currency = (Currency)request.NotificationEvent.Currency switch
            {
                Currency.EUR => "€",
                Currency.UAN => "₴",
                Currency.USD => "$",
                _ => "???",
            };
        var total = $"{currency}{request.NotificationEvent.Total}";
        var senderNotification = new Notification()
        {
            CompanyId = request.NotificationEvent.CompanySenderId,
            CreatedDate = DateTime.UtcNow,
            Operation = NotificationOperation.InvoiceSent,
            ReferenceId = request.NotificationEvent.CompanyReceiverId,
            Message = $"You sent an Invoice to <a href='#'>{companyReceiver!.Name}</a> for {total}",
            MessageWithoutLinks = $"You sent an Invoice to {companyReceiver!.Name} for {total}"
        };
        var receiverNotification = new Notification()
        {
            CompanyId = request.NotificationEvent.CompanyReceiverId,
            CreatedDate = DateTime.UtcNow,
            Operation = NotificationOperation.InvoiceReceived,
            ReferenceId = request.NotificationEvent.CompanySenderId,
            Message = $"<a href='#'>{companySender!.Name}</a> sent you an Invoice for  {total}",
            MessageWithoutLinks = $"{companySender.Name} sent you an Invoice for  {total}"
        };
        
        await _context.Notifications.AddAsync(senderNotification, cancellationToken: cancellationToken);
        await _context.Notifications.AddAsync(receiverNotification, cancellationToken: cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        
        var receiverEmails = _context.Users
            .Where(u => u.NotificationsEnabled && u.CompanyId == receiverNotification.CompanyId)
            .Select(u=>u.Email);
        await _emailNotificationsSender.SendEmails(receiverEmails,receiverNotification.MessageWithoutLinks,cancellationToken);
        var senderEmails = _context.Users
            .Where(u => u.NotificationsEnabled && u.CompanyId == senderNotification.CompanyId)
            .Select(u=>u.Email);
        await _emailNotificationsSender.SendEmails(senderEmails,senderNotification.MessageWithoutLinks,cancellationToken);
        return Unit.Value;
    }
}