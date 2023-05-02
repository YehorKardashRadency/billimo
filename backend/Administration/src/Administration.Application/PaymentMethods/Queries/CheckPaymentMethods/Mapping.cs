using Administration.Domain.Entities;
using AutoMapper;

namespace Administration.Application.PaymentMethods.Queries.CheckPaymentMethods;

public class Mapping : Profile
{
    public Mapping()
    {
        CreateMap<PaymentMethod,ResponseCheckPaymentMethods>();
    }
}