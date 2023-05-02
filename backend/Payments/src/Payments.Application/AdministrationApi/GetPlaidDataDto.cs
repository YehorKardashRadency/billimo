using AutoMapper;
using Payments.Application.Common.Mappings;
using Payments.Domain.Entities;

namespace Payments.Application.AdministrationApi;

public class GetPlaidDataDto : IMapFrom<PostponedPaymentInfo>
{
    public string CompanyName { get; set; } = null!;
    public string AccountId { get; set; } = null!;
    public string AccessToken { get; set; } = null!;

    public void Mapping(Profile profile)
    {
        profile.CreateMap<PostponedPaymentInfo, GetPlaidDataDto>()
            .ForMember(x => x.AccessToken, o => o.MapFrom(d => d.AccessToken))
            .ForMember(x => x.AccountId, o => o.MapFrom(d => d.AccountId));
    }
}