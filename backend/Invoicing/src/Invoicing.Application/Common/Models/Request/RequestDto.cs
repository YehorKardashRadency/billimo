using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Invoicing.Application.Common.Models.Request;
public class RequestDto
{
    public string? Search { get; set; }
    public string[]? Sort { get; set; }
    public string[]? Filter { get; set; }
}
