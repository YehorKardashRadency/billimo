using Administration.Application.Companies.Dto;
using Administration.Application.PaymentMethods.Queries;
using Administration.Application.RegisterCompany.Commands;
using Administration.Application.Users.Dto;
using Administration.Domain.Entities;
using AutoMapper;
using EventBus.Messages.Events;

namespace Administration.Application.Common.Mapping
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<User, UserDto>()
                .ForMember(d => d.Avatar, o => o.MapFrom(s => s.Avatar != null ?
                    "data:image/png;base64," + Convert.ToBase64String(s.Avatar) : null))
                .ReverseMap();

            CreateMap<User, EmployeeDto>();

            CreateMap<Address, AddressDtoRes>();
            CreateMap<AddressDtoReq, Address>();
            CreateMap<FirstAddressDTO, Address>();

            CreateMap<PaymentMethod,GetPlaidDataDto>()
                .ForMember(dst=>dst.AccessToken,src=>src.MapFrom(x=>x.PlaidBankAccount.PlaidBankIntegration.AccessToken))
                .ForMember(dst=>dst.AccountId,src=>src.MapFrom(x=>x.PlaidBankAccount.AccountId))
                .ForMember(dst=>dst.CompanyName,src=>src.MapFrom(x=>x.Company.Name));
        }
    }
}
