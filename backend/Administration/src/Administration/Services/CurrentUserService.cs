using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Administration.Application.Common.Interfaces;
using Administration.Domain.Entities;

namespace Administration.Services;

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
    public long Companyid => long.Parse(_httpContextAccessor.HttpContext?.Request.Headers["claim_companyid"] ?? "0");
    
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