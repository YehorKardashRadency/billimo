using AutoMapper;
using Invoicing.Application.Common.Mapping;
using Invoicing.Domain.Common;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Invoicing.Application.Common.Models.Request;
public class PaginatedRequest : Request, IMapFrom<PaginatedRequestDto>
{
    public int PageIndex { get; set; }
    public int PageSize { get; set; }

    public override void Mapping(Profile profile)
    {
        profile.CreateMap<PaginatedRequestDto, PaginatedRequest>()
            .IncludeBase<RequestDto, Request>();
    }
}
