using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Invoicing.Domain.Entities;

namespace Invoicing.Application.Common.Models.Administration;
public class PaymentMethodDto
{
    public long Id { get; set; }
    public string Title { get; set; }  = string.Empty;
    public string? Additional { get; set; }
    public PaymentMethodType MethodType { get; set; }
}
