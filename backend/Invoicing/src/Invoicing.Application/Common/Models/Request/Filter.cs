using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Invoicing.Application.Common.Models.Request;
public class Filter
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public FilterType FilterType { get; set; }
}
