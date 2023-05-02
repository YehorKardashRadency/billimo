using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Application.Common.Models.Identity;
public class TokenRequest
{
    [Required]
    public string Token { get; set; } = null!;
    [Required]  
    public string RefreshToken { get; set; } = null!;
}
