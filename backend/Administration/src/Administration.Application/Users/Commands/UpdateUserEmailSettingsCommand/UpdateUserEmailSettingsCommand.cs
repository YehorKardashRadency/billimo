using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Users.Commands.UpdateUserEmailSettingsCommand;
public class UpdateUserEmailSettingsCommand: IRequest
{
    public UpdateUserEmailSettingsDto EmailSettings { get; set; } = null!;
}

public class UpdateUserEmailSettingsCommandHandler : IRequestHandler<UpdateUserEmailSettingsCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateUserEmailSettingsCommandHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdateUserEmailSettingsCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.Id;
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId)
            ?? throw new NotFoundException();

        _mapper.Map(request.EmailSettings, user);
        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return Unit.Value;
    }
}
