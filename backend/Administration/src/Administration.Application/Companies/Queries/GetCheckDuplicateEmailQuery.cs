using Administration.Application.Common.Interfaces;
using Administration.Application.Companies.Dto;
using AutoMapper;
using MediatR;

namespace Administration.Application.Companies.Queries;

public readonly record struct CheckOnDuplicateEmailQuery(string email)
    : IRequest<ResponseCheckDuplicateEmail>;


public class GetCheckDuplicateEmailQueryHandler : IRequestHandler<CheckOnDuplicateEmailQuery, ResponseCheckDuplicateEmail>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetCheckDuplicateEmailQueryHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<ResponseCheckDuplicateEmail> Handle(CheckOnDuplicateEmailQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.Companyid;
        var isDuplicate = _context.Companies.Any(x => x.Email == request.email && x.Id != companyId);
        return new ResponseCheckDuplicateEmail(){Email = request.email, IsDuplicate = isDuplicate};
    }
}