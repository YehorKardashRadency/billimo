using AutoMapper;
using Payments.Application.BillPayment.Dto;
using Payments.Domain.Entities;

namespace Payments.Application.Common.Mapping;
public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<PaymentStatistic, PaymentStatisticsDto>();
        
    }
}