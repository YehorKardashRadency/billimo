using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Invoicing.Application.Bills.Queries.ReceivedBills;
using Invoicing.Application.Bills.Queries.SentBills;
using Invoicing.Application.Common.Mapping;
using Invoicing.Domain.Entities;

namespace Invoicing.Application.Bills.Queries.ExportSentBills;
public class ExportSentBillsDto : IMapFrom<Bill>
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
    public long CompanyId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public void Mapping(Profile profile)
    {
        profile.CreateMap<Bill, ExportSentBillsDto>()
            .ForMember(x => x.DueDate, y => y.MapFrom(x => x.Invoice.DueDate))
            .ForMember(x => x.CreatedDate, y => y.MapFrom(x => x.Invoice.CreatedDate))
            .ForMember(x => x.CompanyName, y => y.MapFrom(x => x.Invoice.Buyer.Name))
            .ForMember(x => x.CompanyId, y => y.MapFrom(x => x.Invoice.Buyer.RefId))
            .ForMember(x => x.PaymentMethodId, y => y.MapFrom(x => x.PaymentMethodId))
            .ForMember(x => x.Amount, y => y.MapFrom(x => x.Invoice.Total))
            .ForMember(x => x.Currency, y => y.MapFrom(x => x.Invoice.Currency.ToString()))
            .AfterMap<MapExportSentBillsExternalData>();
    }
}
