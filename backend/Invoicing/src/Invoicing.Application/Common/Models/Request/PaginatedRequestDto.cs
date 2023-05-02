using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Invoicing.Application.Common.Models.Request;
public class PaginatedRequestDto : RequestDto
{
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
}
