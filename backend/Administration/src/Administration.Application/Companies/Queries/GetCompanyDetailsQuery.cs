using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Companies.Dto;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Companies.Queries
{
    public class GetCompanyDetailsQuery : IRequest<CompanyDetailsDto>
    {
        public long CompanyId { get; set; }
    }

    public class GetCompanyDetailsQueryHandler : IRequestHandler<GetCompanyDetailsQuery, CompanyDetailsDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        public GetCompanyDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<CompanyDetailsDto> Handle(GetCompanyDetailsQuery request, CancellationToken cancellationToken)
        {
            var company=await _context.Companies.AsNoTracking()
                .Where(x => x.Id == request.CompanyId)
                .Include(c => c.Addresses)
                .Include(c => c.PaymentMethods)
                .ProjectTo<CompanyDetailsDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync() ?? throw new NotFoundException();
            return company;
        }
    }
}