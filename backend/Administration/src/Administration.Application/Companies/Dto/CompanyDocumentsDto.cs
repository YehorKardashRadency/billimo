using Administration.Application.Common.Mappings;
using Administration.Domain.Entities;
using AutoMapper;

namespace Administration.Application.Companies.Dto;
public class CompanyDocumentsDto: IMapFrom<Company>
{
    public string Name { get; set; }
    public string Email { get; set; }

    public BusinessType BusinessType { get; set; }
    public string Logo { get; set; }
    public string Tax { get; set; }
    public string Registration { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<Company, CompanyDocumentsDto>()
            .ForMember(d => d.Logo, o => o.MapFrom(c => c.Logo != null ?
                "data:image/svg+xml;base64," + Convert.ToBase64String(c.Logo) : null))
            .ReverseMap()
                .ForMember(x => x.Logo, opt => opt.MapFrom(c =>
                    Convert.FromBase64String(c.Logo.Replace("data:image/svg+xml;base64,", string.Empty))));
    }
}
