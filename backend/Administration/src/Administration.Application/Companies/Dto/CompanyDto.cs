using Administration.Application.Common.Mappings;
using Administration.Domain.Entities;
using AutoMapper;

namespace Administration.Application.Companies.Dto;
public class CompanyDto : IMapFrom<Company>
{
    public long Id { get; set; }
    public bool IsVerified { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public byte[] Logo { get; set; }
    public AddressDto Address { get; set; }
    public void Mapping(Profile profile)
    {
        profile.CreateMap<Company, CompanyDto>()
            .ForMember(d => d.Address, opt => opt.MapFrom(c => c.Addresses.FirstOrDefault(a => a.Id == c.DefaultAddressId)))
            .ReverseMap();
    }
}
