using System;
using EventBus.Messages.Events;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Payments.Application.Common.Interfaces;
using Payments.Domain.Entities;

namespace Payments.Application.BillPayment.Commands;
public record CreatePaymentStatisticCommand(CreatePaymentStatisticEvent createPaymentStatisticEvent) : IRequest;

public class CreatePaymentStatisticCommandHandler : IRequestHandler<CreatePaymentStatisticCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    public CreatePaymentStatisticCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(CreatePaymentStatisticCommand request, CancellationToken cancellationToken)
    {
        var companyId = request.createPaymentStatisticEvent.CompanyId;

        var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == companyId);
        if (company == null)
        {
            company = new Company
            {
                Name = request.createPaymentStatisticEvent.CompanyName,
                Id = companyId
            };
            await _context.Companies.AddAsync(company);
            await _context.SaveChangesAsync(cancellationToken);
        }

        var newStatistics = new List<PaymentStatistic>
        {
            new PaymentStatistic
            {
                CompanyId = companyId,
                Tab = TabType.Send,
                Paid = 0,
                ForPayment = 0
            },
            new PaymentStatistic
            {
                CompanyId = companyId,
                Tab = TabType.Receive,
                Paid = 0,
                ForPayment = 0
            },
        };
        await _context.PaymentStatistics.AddRangeAsync(newStatistics, cancellationToken);
        await _context.SaveChangesAsync();

        return Unit.Value;
    }
}
