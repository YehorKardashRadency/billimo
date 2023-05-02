
using AutoMapper;
using Invoicing.Application.Common.Mapping;
using Invoicing.Application.Common.Models;
using Invoicing.Domain.Entities;

namespace Invoicing.Application.Bills.Queries.ReceivedBills;
public class ReceivedBillsDto : IMapFrom<Bill>
{
    public long Id { get; set; }
    public long InvoiceId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public DateTime CreatedDate { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public long PaymentMethodId { get; set; }
    public BillStatus Status { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public byte[]? CompanyLogo { get; set; }
    public long CompanyId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public ApprovalStatus ApprovalStatus { get; set; }
    public BillCancellationDto? BillCancellation { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<Bill, ReceivedBillsDto>()
            .ForMember(x => x.DueDate, y => y.MapFrom(x => x.Invoice.DueDate))
            .ForMember(x => x.CreatedDate, y => y.MapFrom(x => x.Invoice.CreatedDate))
            .ForMember(x => x.CompanyName, y => y.MapFrom(x => x.Invoice.Seller.Name))
            .ForMember(x => x.CompanyId, y => y.MapFrom(x => x.Invoice.Seller.RefId))
            .ForMember(x => x.PaymentMethodId, y => y.MapFrom(x => x.PaymentMethodId))
            .ForMember(x => x.Amount, y => y.MapFrom(x => x.Invoice.Total))
            .ForMember(x => x.Currency, y => y.MapFrom(x => x.Invoice.Currency.ToString()))
            .ForMember(x => x.BillCancellation, y => y.MapFrom(x => x.BillCancellation))
            .AfterMap<MapReceivedBillExternalData>();
    }
}
