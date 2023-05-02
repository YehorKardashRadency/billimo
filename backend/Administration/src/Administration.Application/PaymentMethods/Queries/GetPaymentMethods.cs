using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Mappings;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.PaymentMethods.Queries;
public class GetPaymentMethodsQuery: IRequest<List<PaymentMethodModel>>
{
    public IEnumerable<long>? filterId { get; set; }
}

public class GetPaymentMethodsQueryHandler : IRequestHandler<GetPaymentMethodsQuery, List<PaymentMethodModel>>
{
    private readonly ICurrentUserService _userService;
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetPaymentMethodsQueryHandler(IApplicationDbContext context, IMapper mapper,
        ICurrentUserService userService)
    {
        _context = context;
        _mapper = mapper;
        _userService = userService;
    }

    public async Task<List<PaymentMethodModel>> Handle(GetPaymentMethodsQuery request, CancellationToken cancellationToken)
    {
        var companyId = _userService.Companyid;

        var query = _context.PaymentMethods
            .Where(x => x.CompanyId == companyId);

        if (request.filterId != null)
        {
            query = query.Where(x => request.filterId.Contains(x.Id));
        }

        var payments = await query.OrderByDescending(x => x.Id)
            .ProjectToListAsync<PaymentMethodModel>(_mapper.ConfigurationProvider);
        return payments;
    }
}