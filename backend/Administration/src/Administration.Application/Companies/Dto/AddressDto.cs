using Administration.Application.Common.Mappings;
using Administration.Domain.Entities;
using AutoMapper;

namespace Administration.Application.Companies.Dto;
public class AddressDto : IMapFrom<Address>
{
    public string Title { get; set; }
    public string Country { get; set; }
    public string City { get; set; }
    public string Street { get; set; }
    public string Apartment { get; set; }
    public string ZipCode { get; set; }
    public void Mapping(Profile profile)
    {
        profile.CreateMap<Address, AddressDto>().ReverseMap();
    }
}
