
using Invoicing.Domain.Entities;

namespace Invoicing.Application.Common.Interfaces;

public interface ICurrentUserService
{
    public long Id { get; }
    public string? Name { get; }
    public Role Role { get; }
    public long Companyid { get; }
}