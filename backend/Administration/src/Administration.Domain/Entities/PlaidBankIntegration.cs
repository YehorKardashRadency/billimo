using Administration.Domain.Common;

namespace Administration.Domain.Entities;
public class PlaidBankIntegration: BaseEntity
{
    public string AccessToken { get; set; } = null!;
    public string InstitutionId { get; set; } = null!;

    public ICollection<PlaidBankAccount> Accounts { get; set; } = new List<PlaidBankAccount>();
}
