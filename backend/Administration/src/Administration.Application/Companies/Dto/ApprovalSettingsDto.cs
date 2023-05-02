using Administration.Application.Common.Mappings;
using Administration.Domain.Entities;
using AutoMapper;

namespace Administration.Application.Companies.Dto;
public class ApprovalSettingsDto: IMapFrom<Company>
{
    public bool OnPayingInvoicesHigherThan { get; set; }
    public bool OnSendingInvoicesHigherThan { get; set; }

    public decimal PayingInvoicesThreshold { get; set; }
    public decimal SendingInvoicesThreshold { get; set; }

    public bool OnSendingAllInvoices { get; set; } = false;

    public void Mapping(Profile profile)
    {
        profile.CreateMap<Company, ApprovalSettingsDto>()
            .ReverseMap();
    }
}
