using AutoMapper;
using Invoicing.Application.Common.Mapping;
using Invoicing.Application.Common.Models;
using Invoicing.Domain.Entities;

namespace Invoicing.Application.Invoicing.Queries
{
    public class InvoiceDto : IMapFrom<Invoice>
    {
        public long Id { get; set; }
        public string Number { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime DueDate { get; set; }
        public string Notes { get; set; }
        public ICollection<Common.Models.InvoiceItemDto> Items { get; set; }
        public string Currency { get; set; }
        public long? BuyerId { get; set; }
        public string? BuyerEmail { get; set; }
        public long SellerId { get; set; }
        public decimal Total { get; set; }
        public int ApprovalStatus { get; set; }
        public string Type { get; set; }
        public string PaymentStatus { get; set; }
        public string Category { get; set; }
        public CompanyModel Company { get; set; }
        
        public string TemplatePreview { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Invoice, InvoiceDto>()
                .ForMember(i => i.TemplatePreview,
                    opt => opt.MapFrom(d =>
                        d.TemplatePreview == null
                            ? null
                            : "data:image/png;base64,"+Convert.ToBase64String(d.TemplatePreview)))
                .ForMember(ii => ii.SellerId, o => o.MapFrom(i => i.Seller.RefId))
                .ForMember(ii => ii.BuyerId, o => o.MapFrom(i => i.Buyer != null ? i.Buyer.RefId : (long?)null))
                .ForMember(ii => ii.Category, o => o.MapFrom(i => i.Items.First().Description));
        }
    }
}
