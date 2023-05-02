using Going.Plaid.Entity;

namespace Payments.Application.Common.Models;

public class TransferAuthCreateModel
{
    public string? AccessToken { get; set; }
    
    public string AccountId { get; set; }
    
    public TransferType Type { get; set; }
    
    public string Amount { get; set; }
    
    public TransferNetwork Network { get; set; }
    
    public AchClass AchClass { get; set; }
    
    public string LegalName { get; set; }

    public string IpAddress { get; set; }

    public string UserAgent { get; set; }
}