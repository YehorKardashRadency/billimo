using Administration.Application.Common.Mappings;
using Administration.Domain.Entities;
using AutoMapper;

namespace Administration.Application.Users.Commands.UpdateUserEmailSettingsCommand;
public class UpdateUserEmailSettingsDto: IMapFrom<User>
{
    public bool TwoFactorEnabled { get; set; }
    public bool NotificationsEnabled { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<User, UpdateUserEmailSettingsDto>().ReverseMap();
    }
}
