using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Companies.Dto;
using Administration.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Companies.Commands;
public class UpdateApprovalSettingsCommand : IRequest
{
    public ApprovalSettingsDto ApprovalSettings { get; set; }
}

public class UpdateApprovalSettingsCommandHandler : IRequestHandler<UpdateApprovalSettingsCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _userService;

    public UpdateApprovalSettingsCommandHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService userService)
    {
        _context = context;
        _mapper = mapper;
        _userService = userService;
    }

    public async Task<Unit> Handle(UpdateApprovalSettingsCommand request, CancellationToken cancellationToken)
    {
        var companyId = _userService.Companyid;
        if (_userService.Role is not (Role.Admin or Role.Director)) throw new ForbiddenAccessException();
        var company = await _context.Companies.FirstOrDefaultAsync(x => x.Id == companyId) ?? throw new NotFoundException();

        _mapper.Map(request.ApprovalSettings, company);

        _context.Companies.Update(company);
        await _context.SaveChangesAsync();

        return Unit.Value;
    }
}