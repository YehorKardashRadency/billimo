using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Going.Plaid.Entity;
using Going.Plaid.Item;

namespace Administration.Infrastructure.Plaid;
public class LinkResult
{
    public ItemPublicTokenExchangeRequest PublicToken { get; set; } = new ItemPublicTokenExchangeRequest();
    public LinkMetadata Metadata { get; set; } = new LinkMetadata();
};

public record LinkMetadata
{
    public ICollection<LinkAccount> Accounts { get; set; } = new List<LinkAccount>();
    public LincInstitution Institution { get; set; } = new LincInstitution();
}

public record LincInstitution
{
    public string institution_id { get; set; } = string.Empty;
    public string name { get; set; } = string.Empty;
}

public record LinkAccount
{
    public string id { get; set; } = string.Empty;
    public string name { get; set; } = string.Empty;
    public string mask { get; set; } = string.Empty;
    public string type { get; set; } = string.Empty;
    public string subtype { get; set; } = string.Empty;
    public string? class_type { get; set; }
    public string? verification_status { get; set; }
}