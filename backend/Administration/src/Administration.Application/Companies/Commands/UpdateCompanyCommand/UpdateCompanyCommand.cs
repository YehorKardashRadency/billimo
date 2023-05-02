using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Mappings;
using Administration.Application.Companies.Dto;
using Administration.Domain.Entities;
using AutoMapper;
using EventBus.Messages.Events;
using MassTransit;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Companies.Commands.UpdateCompanyCommand;

public class UpdateCompanyCommand : IRequest, IMapFrom<Company>
{
    public CompanyDocumentsDto Documents { get; set; } = null!;
}

public class UpdateCompanyCommandHandler : IRequestHandler<UpdateCompanyCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _userService;
    private readonly IPublishEndpoint _publishEndpoint;

    public UpdateCompanyCommandHandler(IApplicationDbContext context, 
        IMapper mapper, 
        ICurrentUserService userService,
        IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _mapper = mapper;
        _userService = userService;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<Unit> Handle(UpdateCompanyCommand request, CancellationToken cancellationToken)
    {
        var companyId = _userService.Companyid;
        if (_userService.Role is not (Role.Admin or Role.Director)) throw new ForbiddenAccessException();
        var documents = request.Documents;
        Company company = await _context.Companies.FirstOrDefaultAsync(x => x.Id == companyId)
            ?? throw new NotFoundException();

        _mapper.Map(documents, company);
        _context.Companies.Update(company);

        await _context.SaveChangesAsync();
        await _publishEndpoint.Publish(new UpdateCompanyInfoEvent() { RefId = company.Id, Name = company.Name});
        return Unit.Value;
    }
}