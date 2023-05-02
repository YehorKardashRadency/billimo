using Administration.Application.Common.Mappings;
using Administration.Domain.Entities;
using AutoMapper;

namespace Administration.Application.Users.Queries.GetUserSettingsQuery;
public class GetUserSettingsDto : IMapFrom<User>
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Avatar { get; set; }

    public bool NotificationsEnabled { get; set; }
    public bool TwoFactorEnabled { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<User, GetUserSettingsDto>()
            .ForMember(d => d.Name, o => o.MapFrom(s => $"{s.FirstName} {s.LastName}"))
            .ForMember(d => d.Avatar, o => o.MapFrom(s => s.Avatar != null ? 
                "data:image/png;base64," + Convert.ToBase64String(s.Avatar) : null));
    }
}

