using Administration.Application.Common.Mappings;
using Administration.Application.PaymentMethods.Queries;
using Administration.Domain.Entities;
using AutoMapper;

namespace Administration.Application.Companies.Dto
{
    public class CompanyDetailsDto : IMapFrom<Company>
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
        public byte[] Logo { get; set; }
        public ICollection<PaymentMethodModel> PaymentMethods { get; set; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<Company, CompanyDetailsDto>()
                .ForMember(cd => cd.Street, o => o.MapFrom(c => c.Addresses.FirstOrDefault(a => a.Id == c.DefaultAddressId)!.Street))
                .ForMember(cd => cd.City, o => o.MapFrom(c => c.Addresses.FirstOrDefault(a => a.Id == c.DefaultAddressId)!.City))
                .ForMember(cd => cd.ZipCode, o => o.MapFrom(c => c.Addresses.FirstOrDefault(a => a.Id == c.DefaultAddressId)!.ZipCode));
        }
    }
}
