using Administration.Application.Common.Mappings;
using Administration.Domain.Entities;
using AutoMapper;

namespace Administration.Application.Users.Commands.UpdateUserProfileCommand;
public class UpdateUserProfileDto: IMapFrom<User>
{
    public string? Avatar { get; set; }
    public string Name { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<User, UpdateUserProfileDto>()
            .ReverseMap()
            .ForMember(d => d.Avatar, o => o.Ignore())
            .ForMember(d => d.FirstName, o => o.MapFrom(t => t.Name.Split(" ", 2, StringSplitOptions.None).First()))
            .ForMember(d => d.LastName, o => o.MapFrom(t => t.Name.Split(" ", 2, StringSplitOptions.None).Last()));
    }
}

