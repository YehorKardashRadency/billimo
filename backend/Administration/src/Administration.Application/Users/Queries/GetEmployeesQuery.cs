using Administration.Application.Common.Interfaces;
using Administration.Application.Users.Dto;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Users.Queries;
public readonly record struct GetEmployees(long companyId)
    : IRequest<IEnumerable<EmployeeDto>>;

public class GetEmployeesQueryHandler : IRequestHandler<GetEmployees, IEnumerable<EmployeeDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    public GetEmployeesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<EmployeeDto>> Handle(GetEmployees request, CancellationToken cancellationToken)
    {
        var employees = await _context.Users.Where(x => x.CompanyId == request.companyId).ToListAsync();
        var employeesDto = _mapper.Map<List<EmployeeDto>>(employees);
        return employeesDto;
    }
}
