using AutoMapper;
using Invoicing.Application.Common.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Payments.Application.AdministrationApi;
using Payments.Application.Common.Interfaces;
using Payments.Application.Common.Models;
using Payments.Application.Transactions.Dto;
using Payments.Domain.Entities;

namespace Payments.Application.Transactions.Commands.CancelScheduledBillCommand;
public class CancelScheduledBillCommand: IRequest
{
    public CancelBillDto CancelBillDto { get; set; }
}

public class CancelScheduledBillCommandHandler: IRequestHandler<CancelScheduledBillCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IInvoiceApi _invoiceApi;
    private readonly IAdministrationApi _administrationApi;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;
    private readonly IPlaidService _plaidService;

    public CancelScheduledBillCommandHandler(IApplicationDbContext context,
        IInvoiceApi invoiceApi, IAdministrationApi administrationApi,
        ICurrentUserService currentUserService, IPlaidService plaidService, IMapper mapper)
    {
        _context = context;
        _invoiceApi = invoiceApi;
        _administrationApi = administrationApi;
        _currentUserService = currentUserService;
        _plaidService = plaidService;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(CancelScheduledBillCommand request, CancellationToken cancellationToken)
    {
        var billId = request.CancelBillDto.BillId;
        var companyId = _currentUserService.Companyid;

        var transaction = await _context.Transactions
            .Include(x => x.PlaidTransfers)
            .FirstOrDefaultAsync(x => x.BillId == billId)
            ?? throw new NotFoundException();

        if (transaction.SellerId != companyId && transaction.BuyerId != companyId)
            throw new ForbiddenAccessException();

        if (transaction.Status != TransactionStatus.Pending)
            throw new ConflictException("The transaction has already been completed");

        var plaidDataBuyer = await _administrationApi.GetPlaidData(transaction.BuyerId, new GetPlaidBody())
            ?? throw new NotFoundException();

        var cancelOperation = new PlaidTransferOperationDto() { ClientInformation = plaidDataBuyer };
        _mapper.Map(transaction, cancelOperation);

        await _plaidService.MakeWithdrawalTransactionAsync(cancelOperation);

        var postponedInfo = await _context.PostponedPaymentInfo.Where(x => x.TransactionId == transaction.Id).FirstAsync();
        _context.PostponedPaymentInfo.Remove(postponedInfo);

        transaction.Status = TransactionStatus.Cancelled;

        var paid = transaction.Amount;
        var recievePaymentStatistic = await _context.PaymentStatistics.FirstOrDefaultAsync(p =>
            p.CompanyId == transaction.BuyerId
            && p.Tab == TabType.Receive);

        recievePaymentStatistic!.Paid -= paid;
        _context.PaymentStatistics.Update(recievePaymentStatistic);

        await _context.SaveChangesAsync();

        request.CancelBillDto.CompanyId = companyId;
        await _invoiceApi.CancelBill(request.CancelBillDto);

        return Unit.Value;
    }
}

