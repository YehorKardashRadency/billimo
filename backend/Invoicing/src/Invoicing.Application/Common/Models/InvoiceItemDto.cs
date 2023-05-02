using System.Text.Json.Serialization;
using AutoMapper;
using Invoicing.Application.Common.Mapping;
using Invoicing.Domain.Entities;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace Invoicing.Application.Common.Models;
public class InvoiceItemDto : IMapFrom<InvoiceItem>
{
    public string Description { get; set; }
    public decimal Price { get; set; }
    public Metric Metric { get; set; }
    public int Count { get; set; }
    public decimal Subtotal { get; set; }
    public void Mapping(Profile profile)
    {
        profile.CreateMap<InvoiceItem, InvoiceItemDto>()
            .ForMember(d => d.Metric, opt => opt.MapFrom(i => (int)i.Metric))
            .ReverseMap();
    }
}
