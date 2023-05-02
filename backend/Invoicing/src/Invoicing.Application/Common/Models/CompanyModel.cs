namespace Invoicing.Application.Common.Models;

public class CompanyModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public byte[] Logo { get; set; }
}
