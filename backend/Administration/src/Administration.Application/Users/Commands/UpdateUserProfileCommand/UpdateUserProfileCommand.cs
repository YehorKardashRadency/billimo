using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Users.Commands.UpdateUserProfileCommand;
public class UpdateUserProfileCommand: IRequest
{
    public UpdateUserProfileDto Profile { get; set; }
}

public class UpdateUserProfileCommandHandler : IRequestHandler<UpdateUserProfileCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _userService;
    private readonly IThumbnailService _thumbnailService;

    public UpdateUserProfileCommandHandler(IApplicationDbContext context, IMapper mapper,
        ICurrentUserService userService, IThumbnailService thumbnailService)
    {
        _context = context;
        _mapper = mapper;
        _userService = userService;
        _thumbnailService = thumbnailService;
    }

    public async Task<Unit> Handle(UpdateUserProfileCommand request, CancellationToken cancellationToken)
    {
        var profile = request.Profile;
        var userId = _userService.Id;
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId)
            ?? throw new NotFoundException();

        byte[]? avatar = null; 
        if (profile.Avatar != null)
        {
            var imageData = profile.Avatar.Split(',', 2);
            if (imageData.Length < 2)
                throw new ArgumentException(nameof(profile.Avatar));

            avatar = _thumbnailService.ResizeImage(imageData[1], new Size(80, 80));
        }

        user.Avatar = avatar;
        _mapper.Map(profile, user);
        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return Unit.Value;
    }



}
