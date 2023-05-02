using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Invoicing.Application.Common.Models.Administration;
public class AddressDto
{
    public string Title { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string Apartment { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
}
