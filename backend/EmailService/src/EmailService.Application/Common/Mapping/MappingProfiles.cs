using AutoMapper;
using EmailService.Application.Email.Dto;
using EventBus.Messages.Events;

namespace EmailService.Application.Common.Mapping
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // CreateMap<UserRegistrationEvent, SendEmailDto>()
            //     .ForMember(s => s.ReceiverEmail, o => o.MapFrom(u => u.Email))
            //     .ForMember(s => s.ReceiverName, o => o.MapFrom(u => u.UserName))
            //     .ForMember(s => s.ReceiverOneTimePassword, o => o.MapFrom(u => u.OneTimePassword));
        }
    }
}
