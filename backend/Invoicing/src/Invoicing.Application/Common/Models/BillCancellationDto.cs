using AutoMapper;
using Invoicing.Application.Common.Mapping;
using Invoicing.Domain.Entities;

namespace Invoicing.Application.Common.Models;
public class BillCancellationDto: IMapFrom<BillCancellation>
{
    public string CompanyName { get; set; }
    public DateTime CancellationTime { get; set; }
    public string Reason { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<BillCancellation, BillCancellationDto>()
            .ForMember(x => x.CompanyName, opt => opt.MapFrom(t => t.Company.Name));
    }
}
