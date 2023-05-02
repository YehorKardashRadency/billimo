using EventBus.Messages.Events;
using Invoicing.Application.Common.Exceptions;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Application.Common.Models;
using MassTransit;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Application.Invoicing.Commands.UpdateBuyerInvoices
{
    public record UpdateBuyerInvoicesCommand(UpdateBuyerInvoicesEvent updateBuyerInvoicesEvent) : IRequest<Result>;

    public class UpdateBuyerInvoicesCommandHandler : IRequestHandler<UpdateBuyerInvoicesCommand, Result>
    {
        private readonly IApplicationDbContext _context;
        private readonly IPublishEndpoint _publishEndpoint;

        public UpdateBuyerInvoicesCommandHandler(IApplicationDbContext context, IPublishEndpoint publishEndpoint)
        {
            _context = context;
            _publishEndpoint = publishEndpoint;
        }

        public async Task<Result> Handle(UpdateBuyerInvoicesCommand request, CancellationToken cancellationToken)
        {
            var buyer = await _context.Companies.FirstOrDefaultAsync(c => c.RefId == request.updateBuyerInvoicesEvent.BuyerId);

            if (buyer == null)
            {
                buyer = new Domain.Entities.Company
                {
                    Id =  request.updateBuyerInvoicesEvent.BuyerId,
                    Name = request.updateBuyerInvoicesEvent.BuyerName,
                    RefId = request.updateBuyerInvoicesEvent.BuyerId
                };
                await _context.Companies.AddAsync(buyer);
                await _context.SaveChangesAsync(cancellationToken);
            }

            var bill = await _context.Bills
                .Include(b => b.Invoice)
                .FirstOrDefaultAsync(b => b.Id == request.updateBuyerInvoicesEvent.BillId);

            if (bill == null) throw new NotFoundException();

            await _context.Invoices
                .Where(i => i.BuyerEmail == bill.Invoice.BuyerEmail)
                .ForEachAsync(invoice =>
                {
                    invoice.BuyerId = buyer.Id;
                });

            await _context.SaveChangesAsync(cancellationToken);

            decimal total = _context.Bills
                .Include(b => b.Invoice)
                .Where(b => b.Invoice.BuyerId == buyer.RefId)
                .Sum(b => b.Invoice.Total);

            await _publishEndpoint.Publish(new UpdateBuyerStatisticEvent()
                { BuyerId = buyer.RefId, ForPayment = total }, cancellationToken);

            return Result.Success();
        }
    }
}
