using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Payments.Application.BillPayment.Dto;
using Payments.Application.Common.Interfaces;
using Payments.Domain.Entities;

namespace Payments.Application.BillPayment.Queries;

public readonly record struct GetPaymentStatistics(TabType tab)
    : IRequest<PaymentStatisticsDto>;

public class GetPaymentStatisticsQueryHandler : IRequestHandler<GetPaymentStatistics, PaymentStatisticsDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;
    public GetPaymentStatisticsQueryHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<PaymentStatisticsDto> Handle(GetPaymentStatistics request, CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.Companyid;

        var paymentStatistic = await _context.PaymentStatistics.FirstOrDefaultAsync(p=>p.CompanyId == companyId && p.Tab == request.tab);
        var paymentStatisticDto = _mapper.Map<PaymentStatisticsDto>(paymentStatistic);

        return paymentStatisticDto;
    }
}
