using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Invoicing.Application.Common.Models.Request;
public enum FilterType
{
    equals,
    notEqual,
    greaterThanOrEqual,
    greaterThan,
    lessThanOrEqual,
    lessThan
}
