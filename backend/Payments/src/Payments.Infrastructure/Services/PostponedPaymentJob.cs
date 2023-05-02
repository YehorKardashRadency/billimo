using AutoMapper;
using Invoicing.Application.Bills.Commands.MarkBillsAs;
using Microsoft.EntityFrameworkCore;
using Payments.Application.AdministrationApi;
using Payments.Application.Common.Interfaces;
using Payments.Application.Common.Models;
using Payments.Application.InvoiceApi;
using Payments.Domain.Entities;
using Payments.Infrastructure.Persistence;
using Quartz;

namespace Payments.Infrastructure.Services;

[DisallowConcurrentExecution]
public class PostponedPaymentJob : IJob
{
    private readonly ApplicationDbContext _context;
    private readonly IPlaidService _plaidService;
    private readonly IInvoiceApi _invoiceApi;
    private readonly IMapper _mapper;

    public PostponedPaymentJob(ApplicationDbContext context, IPlaidService plaidService,
        IMapper mapper, IInvoiceApi invoiceApi)
    {
        _context = context;
        _plaidService = plaidService;
        _mapper = mapper;
        _invoiceApi = invoiceApi;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        var timeNow = DateOnly.FromDateTime(DateTime.UtcNow);
        var payments = await _context.PostponedPayments
            .Include(x => x.PostponedPaymentInfo)
                .ThenInclude(x => x.Transaction)
                    .ThenInclude(x => x.Seller)
            .Include(x => x.PostponedPaymentInfo)
                .ThenInclude(x => x.Transaction)
                    .ThenInclude(x => x.Buyer)
            .Where(x => timeNow >= x.PayDate && !x.Paid)
            .ToListAsync();

        if (payments.Count > 0)
        {
            foreach (var payment in payments)
                await HandlePaymentAsync(payment);

            await _invoiceApi.MarkBillsAs(new MarkBillsDto()
            {
                Bills = payments.Select(x => x.PostponedPaymentInfo.Transaction.BillId).ToArray(),
                Status = BillStatus.Pending.ToString()
            });

            await _context.SaveChangesAsync();
        }
    }

    public async Task HandlePaymentAsync(PostponedPayment payment)
    {
        var plaidData = new GetPlaidDataDto()
        {
            CompanyName = payment.PostponedPaymentType == PostponedPaymentType.Withdrawal ?
                payment.PostponedPaymentInfo.Transaction.Seller.Name :
                payment.PostponedPaymentInfo.Transaction.Buyer.Name
        };
        _mapper.Map(payment.PostponedPaymentInfo, plaidData);

        var transferOperation = new PlaidTransferOperationDto() { ClientInformation = plaidData };
        _mapper.Map(payment, transferOperation);
        _mapper.Map(payment.PostponedPaymentInfo, transferOperation);

        if (payment.PostponedPaymentType == PostponedPaymentType.Withdrawal) { 
            await _plaidService.MakeWithdrawalTransactionAsync(transferOperation);

            var sendPaymentStatistic = await _context.PaymentStatistics.FirstOrDefaultAsync(p =>
                p.CompanyId == payment.PostponedPaymentInfo.Transaction.SellerId
                && p.Tab == TabType.Send);

            sendPaymentStatistic!.ForPayment -= transferOperation.Amount;
            sendPaymentStatistic!.Paid += transferOperation.Amount;
            _context.PaymentStatistics.Update(sendPaymentStatistic);
        }
        else
            await _plaidService.MakeDepositTransactionAsync(transferOperation);

        payment.Paid = true;
        _context.PostponedPayments.Update(payment);
    }
}
