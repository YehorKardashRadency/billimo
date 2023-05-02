using AutoMapper;
using Invoicing.Application.Common.Mapping;
using Invoicing.Domain.Entities;

namespace Invoicing.Application.Invoicing.Queries;

public class GetInvoiceDto : IMapFrom<Invoice>
{
    public long Id { get; set; }
    public string Number { get; set; }
    public long? BuyerId { get; set; }
    public long SellerId { get; set; }
    public decimal Total { get; set; }

    //public void Mapping(Profile profile)
    //{
    //    profile.CreateMap<Invoice, GetInvoiceDto>()
    //        .ForMember(ii => ii.SellerId, o => o.MapFrom(i => i.Seller.RefId))
    //        .ForMember(ii => ii.BuyerId, o => o.MapFrom(i => i.Buyer != null ? i.Buyer.RefId : (long?)null));
    //}
}
