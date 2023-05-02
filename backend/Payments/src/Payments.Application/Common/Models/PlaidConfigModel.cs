namespace Payments.Application.Common.Models;

public class PlaidConfigModel
{
    public static string Key = "Plaid";
    public string ClientId { get; set; }
    
    public string Secret { get; set; }
    
}