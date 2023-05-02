using AutoMapper;
using AutoMapper.QueryableExtensions;
using Invoicing.Application.Common.Exceptions;
using Invoicing.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Application.Invoicing.Queries
{
    public class GetBillPaymentDetailsQuery : IRequest<BillPaymentDto>
    {
        public long BillId { get; set; }
    }

    public class GetBillPaymentDetailsQueryHandler : IRequestHandler<GetBillPaymentDetailsQuery, BillPaymentDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAdministrationApi _administrationApi;
        public GetBillPaymentDetailsQueryHandler(IApplicationDbContext context, IMapper mapper, IAdministrationApi administrationApi)
        {
            _context = context;
            _mapper = mapper;
            _administrationApi = administrationApi;
        }

        public async Task<BillPaymentDto> Handle(GetBillPaymentDetailsQuery request, CancellationToken cancellationToken)
        {
            var billPaymentDto = await _context.Bills
                .Where(b => b.Id == request.BillId)
                .ProjectTo<BillPaymentDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync() ?? throw new NotFoundException();

            billPaymentDto.Seller = await _administrationApi.GetCompanyDetails(billPaymentDto.Invoice.SellerId);
            
            billPaymentDto.Buyer = billPaymentDto.Invoice.BuyerId != null
            ? await _administrationApi.GetCompanyDetails((long)billPaymentDto.Invoice.BuyerId)
            : new CompanyDetailsDto { Email = billPaymentDto.Invoice.BuyerEmail! };

            return billPaymentDto;
        }
    }
}
