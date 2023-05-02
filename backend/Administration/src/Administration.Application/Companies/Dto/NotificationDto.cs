using Administration.Application.Common.Extensions;
using Administration.Application.Common.Mappings;
using Administration.Domain.Entities;
using AutoMapper;
using EventBus.Messages.Events;

namespace Administration.Application.Companies.Dto;
public class NotificationDto : IMapFrom<Notification>
{
    public long CompanyId { get; set; }

    public long? ReferenceId { get; set; }

    public NotificationOperation Operation { get; set; } = NotificationOperation.None;

    public string? Message { get; set; }
    public string? MessageWithoutLinks { get; set; }

    public string Date { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<Notification, NotificationDto>()
            .ForMember(b => b.Date, x => x.MapFrom(c => c.CreatedDate.TimeAgo()))
            .ReverseMap();
    }
}
