using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Invoicing.Domain.Entities;
public enum PaymentMethodType
{
    Empty,
    Card,
    Bank,
    Paypal,
}