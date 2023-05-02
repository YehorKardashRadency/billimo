using AutoMapper;
using Going.Plaid.Entity;
using Invoicing.Application.Bills.Commands.MarkBillsAs;
using Invoicing.Application.Common.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Update;
using Payments.Application.AdministrationApi;
using Payments.Application.Common.Interfaces;
using Payments.Application.Common.Models;
using Payments.Application.Transactions.Dto;
using Payments.Domain.Entities;
using Transaction = Payments.Domain.Entities.Transaction;

namespace Payments.Application.Transactions.Commands.PayBillNowCommand;
public readonly record struct PayBillNowCommand(PayBillDto PayBillDto): IRequest<ResponseCreateTransaction>;

public class PayBillNowCommandHandler : IRequestHandler<PayBillNowCommand, ResponseCreateTransaction>
{
    private readonly IApplicationDbContext _context;
    private readonly IInvoiceApi _invoiceApi;
    private readonly IAdministrationApi _administrationApi;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;
    private readonly IPlaidService _plaidService;

    public PayBillNowCommandHandler(IApplicationDbContext context,
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

    public async Task<ResponseCreateTransaction> Handle(PayBillNowCommand request, CancellationToken cancellationToken)
    {
        var bill = await _invoiceApi.GetBillById(request.PayBillDto.BillId)
            ?? throw new NotFoundException();

        var invoice = bill.Invoice;
        if (!Enum.TryParse<BillStatus>(bill.Status, out var billStatus))
            throw new ArgumentException(nameof(bill.Status));

        if (billStatus != BillStatus.Unpaid)
            throw new ConflictException("The bill has already been paid");

        var plaidDataBuyer = await _administrationApi.GetPlaidData(_currentUserService.Companyid, 
            new GetPlaidBody(){ PaymentMethodId = request.PayBillDto.PaymentMethodId }) 
            ?? throw new NotFoundException();

        var plaidDataSeller = await _administrationApi.GetPlaidData(invoice.SellerId, new GetPlaidBody()) 
            ?? throw new NotFoundException();

        var transaction = _mapper.Map<Transaction>(bill);
        var plaidTransferOperation = new PlaidTransferOperationDto() { ClientInformation = plaidDataBuyer };
        _mapper.Map(transaction, plaidTransferOperation);

        await _plaidService.MakeDepositTransactionAsync(plaidTransferOperation);
        plaidTransferOperation.ClientInformation = plaidDataSeller;
        await _plaidService.MakeWithdrawalTransactionAsync(plaidTransferOperation);

        await _invoiceApi.MarkBillsAs(
            new MarkBillsDto()
            {
                Bills = new long[] { bill.Id },
                Status = BillStatus.Paid.ToString()
            });

        var paid = invoice.Total;
        var recievePaymentStatistic = await _context.PaymentStatistics.FirstOrDefaultAsync(p =>
            p.CompanyId == invoice.BuyerId
            && p.Tab == TabType.Receive);

        recievePaymentStatistic!.ForPayment -= paid;
        recievePaymentStatistic!.Paid += paid;
        _context.PaymentStatistics.Update(recievePaymentStatistic);

        var sendPaymentStatistic = await _context.PaymentStatistics.FirstOrDefaultAsync(p =>
            p.CompanyId == invoice.SellerId
            && p.Tab == TabType.Send);

        sendPaymentStatistic!.ForPayment -= paid;
        sendPaymentStatistic!.Paid += paid;
        _context.PaymentStatistics.Update(sendPaymentStatistic);
        await _context.SaveChangesAsync();

        return new ResponseCreateTransaction()
        {
            CompanyName = plaidDataSeller.CompanyName,
            InvoiceNumber = invoice.Number
        };
    }
}