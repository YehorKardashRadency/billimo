using Payments.Domain.Entities;

namespace Payments.Application.Common.Interfaces;

public interface ICurrentUserService
{
    public long Id { get; }
    public string? Name { get; }
    public Role Role { get; }
    public long Companyid { get; }
    public string UserAgent { get; }
    public string IpAddress { get; }
}