using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Invoicing.Application.Common.Models.Request;
public class Sort
{
    public string Field { get; set; } = string.Empty;
    public SortDirection direction { get; set; }
}
