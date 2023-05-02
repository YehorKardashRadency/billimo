using Administration.Domain.Entities;

namespace Administration.Application.Common.Interfaces;

public interface ICurrentUserService
{
    public long Id { get; }
    public string? Name { get; }
    public Role Role { get; }
    public long Companyid { get; }
}