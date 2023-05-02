
using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Models;
using Administration.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Users.Commands;


public readonly record struct PutUserRole(long id, Role role)
    : IRequest<Unit>;

public class UpdateUserRoleCommandHandler : IRequestHandler<PutUserRole,Unit>
{
    private readonly IMapper _mapper;
    private readonly IApplicationDbContext _context;

    public UpdateUserRoleCommandHandler(IMapper mapper, IApplicationDbContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<Unit> Handle(PutUserRole request, CancellationToken cancellationToken)
    {

        var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == request.id);
        
        if (user == null)
        {
            throw new NotFoundException($"Not found user id: {request.id}");
        }
        user.Role = request.role;
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return Unit.Value;
    }
}
