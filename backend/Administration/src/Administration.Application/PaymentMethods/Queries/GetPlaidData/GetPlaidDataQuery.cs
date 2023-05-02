using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Mappings;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.PaymentMethods.Queries
{
    public readonly record struct GetPlaidData(long companyId, long? PaymentMethodId) : IRequest<GetPlaidDataDto>;

    public class GetPlaidDataQueryHandler : IRequestHandler<GetPlaidData, GetPlaidDataDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetPlaidDataQueryHandler(IApplicationDbContext context,
            IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<GetPlaidDataDto> Handle(GetPlaidData request, CancellationToken cancellationToken)
        {
            var query = _context.PaymentMethods.Where(x => x.CompanyId == request.companyId);
            if (request.PaymentMethodId.HasValue)
            {
                query = query.Where(x => x.Id == request.PaymentMethodId && x.PlaidBankAccount != null);
            }
            else
            {
                query = query.Include(x => x.PlaidBankAccount)
                    .ThenInclude(x => x.PlaidBankIntegration)
                    .Where(x => x.PlaidBankAccount != null);
            }

            var plaidDataDto = await query
                .ProjectTo<GetPlaidDataDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            return plaidDataDto;
        }
    }
}