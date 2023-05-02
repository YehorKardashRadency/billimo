using Invoicing.Application.Common.Interfaces;
using Invoicing.Domain.Entities;

namespace Invoicing.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }
    public long Id => long.Parse(_httpContextAccessor.HttpContext?.Request.Headers["claim_id"] ?? "0");
    public string? Name => _httpContextAccessor.HttpContext?.Request.Headers["claim_sub"];
    public Role Role => GetRole();
    public long Companyid 
    { 
        get 
        {
            var g = _httpContextAccessor.HttpContext?.Request.Headers["claim_companyid"].FirstOrDefault() ?? "0";
            return long.Parse(g ?? "0");
        } 
    }

    private Role GetRole()
    {
        try
        {
            return (Role)Enum.Parse(typeof(Role), _httpContextAccessor.HttpContext?.Request.Headers["claim_role"] ?? "Empty");
        }
        catch
        {
            return Role.Empty;
        }
    }
}
