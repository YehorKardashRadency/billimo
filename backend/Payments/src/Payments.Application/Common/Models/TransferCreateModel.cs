namespace Payments.Application.Common.Models;

public class TransferCreateModel
{
    public string AccessToken { get; set; }
    public string AccountId { get; set; }
    public string AuthorizationId { get; set; }
    public string Amount { get; set; }
    public string Description { get; set; }
}