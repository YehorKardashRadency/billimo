using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Going.Plaid;
using Going.Plaid.Transfer;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Payments.Application.Common.Interfaces;
using Payments.Application.Common.Models;
using Payments.Application.Transactions.Commands.ChangeStatus;
using Payments.Domain.Entities;

namespace Payments.Application.Transactions.Commands.Webhook;
public class WebhookCommand : IRequest<Result>
{
    public string Environment { get; set; } = string.Empty;
    public string? Error { get; set; }
    public string? Item_id { get; set; }
    public string Webhook_code { get; set;} = string.Empty;
    public string Webhook_type { get; set; } = string.Empty;  
}

public class WebhookCommandHandler : IRequestHandler<WebhookCommand, Result>
{
    private readonly PlaidClient _plaidClient;
    private readonly PlaidConfigModel _plaidConfigModel;
    private readonly IApplicationDbContext _context;
    private readonly ISender _sender;
    public WebhookCommandHandler(
        PlaidClient plaidClient, 
        IOptions<PlaidConfigModel> plaidConfigModel,
        IApplicationDbContext applicationDbContext,
        ISender sender)
    {
        _plaidClient = plaidClient;
        _plaidConfigModel = plaidConfigModel.Value;
        _context = applicationDbContext;
        _sender = sender;
    }
    public async Task<Result> Handle(WebhookCommand request, CancellationToken cancellationToken)
    {
        if ((request.Environment == "sandbox" && request.Webhook_code == "DEFAULT_UPDATE" && request.Webhook_type == "TRANSACTIONS")
           || (request.Environment == "production" && request.Webhook_code == "TRANSFER_EVENTS_UPDATE" && request.Webhook_type == "TRANSFER"))
        {
            return await UpdatePlaidTransfer();
        }

        return Result.Failure(new List<string>() { "Not implemented exception" });
    }

    private async Task<Result> UpdatePlaidTransfer()
    {
        var lastEvent = await _context.PlaidTransfersEventSync.FirstOrDefaultAsync();
        if (lastEvent == null) 
        {
            var lastEventEntityEntry = await _context.PlaidTransfersEventSync.AddAsync(new PlaidTransfersEventSync() { lastEventId = 0 });
            lastEvent = lastEventEntityEntry.Entity;
        }
              
        while (true)
        {
            var request = new TransferEventSyncRequest()
            {
                ClientId = _plaidConfigModel.ClientId,
                Secret = _plaidConfigModel.Secret,
                AfterId = lastEvent.lastEventId,
                Count = 25

            };

            var response = await _plaidClient.TransferEventSyncAsync(request);
            if (response == null || response.TransferEvents.Count == 0)
            {
                break;
            }
            var newEvents = response.TransferEvents.OrderBy(x => x.EventId);
            var transferIds = response.TransferEvents.Select(x => x.TransferId).ToList();
            var transferChangeEvent = await _context.PlaidTransfers.Where(x => transferIds.Contains(x.TransferId)).ToListAsync();
            foreach (var newEvent in newEvents)
            {
                var transfer = transferChangeEvent.FirstOrDefault(x => x.TransferId == newEvent.TransferId);
                if (transfer != null)
                {
                    transfer.PlaidTransferEventType = (PlaidTransferEventType)Enum.Parse(typeof(PlaidTransferEventType), newEvent.EventType.ToString());
                    transfer.TransactionStatusUpdated = false;
                }
                lastEvent.lastEventId = newEvent.EventId;
            }

            await _context.SaveChangesAsync();
        }

        await _sender.Send(new ChangeTransactionStatusCommand()); //TODO: add a task to the background job
        return Result.Success();
    }
}

