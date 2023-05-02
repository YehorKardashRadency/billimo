using Administration.Application.Common.Interfaces;
using Administration.Application.PaymentMethods.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.PaymentMethods.Queries;
public class GetPaymentsMethodInfoQuery : IRequest<IEnumerable<PaymentMethodDto>>
{
    public IEnumerable<long>? filterId { get; set; }
}
public class GetPaymentsMethodInfoQueryHandler : IRequestHandler<GetPaymentsMethodInfoQuery, IEnumerable<PaymentMethodDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPaymentsMethodInfoQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PaymentMethodDto>> Handle(GetPaymentsMethodInfoQuery request, CancellationToken cancellationToken)
    {
        var methodModels = new List<PaymentMethodDto>();

        if(request.filterId != null)
        {
            foreach (var id in request.filterId)
            {
                var method = await _context.PaymentMethods.FirstOrDefaultAsync(x => x.Id == id);
                methodModels.Add(new PaymentMethodDto { Id = id, Name = method != null ? method!.MethodType.ToString() : "" });
            }
        }

        return methodModels;
    }
}