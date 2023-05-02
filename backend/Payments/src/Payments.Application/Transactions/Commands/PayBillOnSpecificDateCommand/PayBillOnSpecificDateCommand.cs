using AutoMapper;
using Invoicing.Application.Bills.Commands.MarkBillsAs;
using Invoicing.Application.Common.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Payments.Application.AdministrationApi;
using Payments.Application.Common.Interfaces;
using Payments.Application.Common.Models;
using Payments.Application.InvoiceApi;
using Payments.Application.Transactions.Dto;
using Payments.Domain.Entities;

namespace Payments.Application.Transactions.Commands.PayBillOnSpecificDateCommand;
public class PayBillOnSpecificDateCommand: IRequest<ResponseCreateTransaction>
{
    public PayBillDto PayBillDto { get; set; }
}

public class PayBillOnSpecificDateCommandHandler : IRequestHandler<PayBillOnSpecificDateCommand, ResponseCreateTransaction>
{
    private readonly IApplicationDbContext _context;
    private readonly IInvoiceApi _invoiceApi;
    private readonly IAdministrationApi _administrationApi;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;
    private readonly IPlaidService _plaidService;

    public PayBillOnSpecificDateCommandHandler(IApplicationDbContext context,
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

    public async Task<ResponseCreateTransaction> Handle(PayBillOnSpecificDateCommand request, CancellationToken cancellationToken)
    {
        var bill = await _invoiceApi.GetBillById(request.PayBillDto.BillId)
            ?? throw new NotFoundException();

        var invoice = bill.Invoice;
        if (!Enum.TryParse<BillStatus>(bill.Status, out var billStatus))
            throw new ArgumentException(nameof(bill.Status));

        if (billStatus != BillStatus.Unpaid)
            throw new ConflictException("The bill has already been paid");

        var plaidDataBuyer = await _administrationApi.GetPlaidData(_currentUserService.Companyid,
            new GetPlaidBody() { PaymentMethodId = request.PayBillDto.PaymentMethodId })
            ?? throw new NotFoundException();

        var plaidDataSeller = await _administrationApi.GetPlaidData(invoice.SellerId, new GetPlaidBody())
            ?? throw new NotFoundException();

        var transaction = _mapper.Map<Transaction>(bill);

        var plaidTransferOperation = new PlaidTransferOperationDto() {
            ClientInformation = plaidDataBuyer,
        };
        _mapper.Map(transaction, plaidTransferOperation);

        await _plaidService.MakeDepositTransactionAsync(plaidTransferOperation);

        var postponedPaymentInfo = new PostponedPaymentInfo();
        _mapper.Map(transaction, postponedPaymentInfo);
        _mapper.Map(plaidDataSeller, postponedPaymentInfo);

        var postponedPayment = new PostponedPayment() {
            PayDate = DateOnly.FromDateTime(request.PayBillDto.PayDate.Value),
            PostponedPaymentType = PostponedPaymentType.Withdrawal,
        };
        _mapper.Map(transaction, postponedPayment);
        postponedPaymentInfo.Payments.Add(postponedPayment);

        _context.PostponedPaymentInfo.Add(postponedPaymentInfo);
        await _context.SaveChangesAsync();

        await _invoiceApi.MarkBillsAs(
            new MarkBillsDto()
            {
                Bills = new long[] { bill.Id },
                Status = BillStatus.Scheduled.ToString()
            });

        var paid = invoice.Total;
        var recievePaymentStatistic = await _context.PaymentStatistics.FirstOrDefaultAsync(p =>
            p.CompanyId == invoice.BuyerId
            && p.Tab == TabType.Receive);

        recievePaymentStatistic!.ForPayment -= paid;
        recievePaymentStatistic!.Paid += paid;
        _context.PaymentStatistics.Update(recievePaymentStatistic);

        await _context.SaveChangesAsync();

        return new ResponseCreateTransaction()
        {
            CompanyName = plaidDataSeller.CompanyName,
            InvoiceNumber = bill.Invoice.Number,
        };
    }
}
