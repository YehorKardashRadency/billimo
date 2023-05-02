using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Going.Plaid.Transfer;
using Going.Plaid;
using MediatR;
using Microsoft.Extensions.Options;
using Payments.Application.Common.Interfaces;
using Payments.Application.Common.Models;
using Payments.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Payments.Application.Transactions.Commands.ChangeStatus;
public struct ChangeTransactionStatusCommand : IRequest<Result>{}

public class ChangeTransactionStatusCommandHandler : IRequestHandler<ChangeTransactionStatusCommand, Result>
{
    private readonly IApplicationDbContext _context;
    public ChangeTransactionStatusCommandHandler(IApplicationDbContext applicationDbContext)
    {
        _context = applicationDbContext;
    }
    public async Task<Result> Handle(ChangeTransactionStatusCommand request, CancellationToken cancellationToken)
    {
        await UpdateTransactionStatus();
        return Result.Success();
    }

    private async Task UpdateTransactionStatus()
    {
        var queryTransfersChange = _context.PlaidTransfers.Where(x => x.TransactionStatusUpdated == false).Select(x => x);
        var query = _context.Transactions
            .Include(x => x.PlaidTransfers)
            .Where(x => (x.PlaidTransfers != null) && (x.PlaidTransfers.Intersect(queryTransfersChange).Any()));

        var transactions = await query.ToListAsync();
        foreach (var transaction in transactions)
        {
            foreach (var transfer in transaction.PlaidTransfers!)
            {
                transfer.TransactionStatusUpdated = true;
            }

            if (transaction.PlaidTransfers!.Any(x => x.PlaidTransferEventType == PlaidTransferEventType.Failed
                || x.PlaidTransferEventType == PlaidTransferEventType.Cancelled
                || x.PlaidTransferEventType == PlaidTransferEventType.Returned))
            {
                transaction.Status = TransactionStatus.Failed;
                continue;
            };

            if (transaction.PlaidTransfers!.All(x => x.PlaidTransferEventType == PlaidTransferEventType.Settled))
            {
                transaction.Status = TransactionStatus.Settled;
                continue;
            }

            if (transaction.PlaidTransfers!.Any(x => x.PlaidTransferEventType == PlaidTransferEventType.Posted)
                && transaction.PlaidTransfers!.All(x => x.PlaidTransferEventType != PlaidTransferEventType.Pending))
            {
                transaction.Status = TransactionStatus.Posted;
                continue;
            }
        }

        await _context.SaveChangesAsync();
    }
}