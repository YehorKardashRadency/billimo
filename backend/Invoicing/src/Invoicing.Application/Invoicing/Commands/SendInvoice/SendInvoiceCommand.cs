using AutoMapper;
using EventBus.Messages.Events;
using Invoicing.Application.Common.Exceptions;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Application.Common.Models;
using Invoicing.Domain.Entities;
using MassTransit;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Application.Invoicing.Commands.SendInvoice;

public record SendInvoiceCommand(long InvoiceId) : IRequest<Result>;

public class SendInvoiceCommandHandler : IRequestHandler<SendInvoiceCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IAdministrationApi _administrationApi;
    private readonly ICurrentUserService _currentUser;
    public SendInvoiceCommandHandler(IApplicationDbContext context, IMapper mapper, IPublishEndpoint publishEndpoint, ICurrentUserService currentUser, IAdministrationApi administrationApi)
    {
        _context = context;
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
        _currentUser = currentUser;
        _administrationApi = administrationApi;
    }

    public async Task<Result> Handle(SendInvoiceCommand request, CancellationToken cancellationToken)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Seller)
            .Include(i => i.Buyer)
            .FirstOrDefaultAsync(i => i.Id == request.InvoiceId);
            
        if (invoice == null) throw new NotFoundException("Invoice with given ID was not found");
        if (invoice.Type==InvoiceType.Archived)
            throw new BadRequestException("You can't send invoice which status is Archived");
        if( invoice.ApprovalStatus != ApprovalStatus.Approved && _currentUser.Role is not (Role.Admin or Role.Director))
            throw new BadRequestException("You can't send invoice which is not approved");
        
        if (await _context.Bills.FirstOrDefaultAsync(b => b.InvoiceId == request.InvoiceId,
                cancellationToken: cancellationToken) != null)
            throw new ConflictException("Bill already exists");
        invoice.ApprovalStatus = ApprovalStatus.Approved;
        var bill = new Bill() {
            InvoiceId = invoice.Id,
            Invoice = invoice,
            Status = BillStatus.Unpaid,
            BillSecureUrl = Guid.NewGuid(),
            ApprovalStatus = ApprovalStatus.None
        };
        
        await _context.Bills.AddAsync(bill, cancellationToken);
        invoice.Type = InvoiceType.Archived;
        invoice.ApprovalStatus = ApprovalStatus.Approved;
        await _context.SaveChangesAsync(cancellationToken);
        
        if (invoice.BuyerId == null)
        {
            if (string.IsNullOrEmpty(invoice.BuyerEmail)) 
                throw new BadRequestException("Buyer email not found");
            var senderDetails = await _administrationApi.GetCompanyDetails(invoice.Seller.RefId);
            var billEmail = new BillEmail()
            {
                BillId = bill.Id,
                CompanySenderId = senderDetails.Id,
                CompanySenderName = senderDetails.Name,
                CompanyReceiverEmail = invoice.BuyerEmail!,
                Currency = (int)invoice.Currency,
                Total = invoice.Total,
                BillSecureUrl = bill.BillSecureUrl.ToString()
            };
            await _publishEndpoint.Publish(billEmail, cancellationToken);
        }
        else
        {
            var notificationEvent = new BillNotificationEvent()
            {
                CompanySenderId = invoice.Seller.RefId, 
                CompanyReceiverId = invoice.Buyer!.RefId,
                Currency = (int)invoice.Currency,
                Total = invoice.Total
            };
            await _publishEndpoint.Publish(notificationEvent, cancellationToken);
        }

        await _publishEndpoint.Publish(new UpdatePaymentStatisticEvent()
            { SellerId = invoice.SellerId, BuyerId = invoice.BuyerId, ForPayment = invoice.Total }, cancellationToken);
       
        return Result.Success();
    }
}
