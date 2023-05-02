using Administration.Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.PaymentMethods.Queries.CheckPaymentMethods;

public readonly record struct CheckPaymentMethodsQuery()
    : IRequest<List<ResponseCheckPaymentMethods>>;

public class
    CheckPaymentMethodsQueryHandler : IRequestHandler<CheckPaymentMethodsQuery, List<ResponseCheckPaymentMethods>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CheckPaymentMethodsQueryHandler(ICurrentUserService currentUserService, IApplicationDbContext context, IMapper mapper)
    {
        _currentUserService = currentUserService;
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<ResponseCheckPaymentMethods>> Handle(CheckPaymentMethodsQuery request,
        CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.Companyid;
        var methods = await _context.PaymentMethods.Where(x => x.CompanyId == companyId).ToListAsync();
        var methodsDto = _mapper.Map<List<ResponseCheckPaymentMethods>>(methods);
        return methodsDto;
    }
}