using AutoMapper;
using Invoicing.Application.Common.Mapping;
using Invoicing.Domain.Entities;

namespace Invoicing.Application.Bills.Commands.CancelBill;
public class CancelBillDto: IMapFrom<BillCancellation>
{
    public long BillId { get; set; }
    public long CompanyId { get; set; }
    public string CancellationReason { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<CancelBillDto, BillCancellation>()
            .ForMember(x => x.Reason, o => o.MapFrom(t => t.CancellationReason));
    }
}