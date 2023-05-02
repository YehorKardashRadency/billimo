using Payments.Application.Common.Interfaces;
using Payments.Domain.Entities;



namespace Payments.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public long Id
    {
        get
        {
            if (long.TryParse(_httpContextAccessor.HttpContext?.Request.Headers["claim_id"] ,
                    out long id))
            {
                return id;
            }

            return 0;
        }
    }

    public string? Name => _httpContextAccessor.HttpContext?.Request?.Headers["claim_sub"];
    public Role Role
    {
        get
        {
            if (Enum.TryParse(_httpContextAccessor.HttpContext?.Request?.Headers["claim_role"] ?? "Empty",
                    out Role role))
            {
                return role;
            }
            return Role.Empty;
        }
    }

    public long Companyid
    {
        get
        {
            if (long.TryParse(_httpContextAccessor.HttpContext?.Request.Headers["claim_companyid"] ,
                    out long companyId))
            {
                return companyId;
            }

            return 0;
        }
    }

    public string UserAgent => _httpContextAccessor.HttpContext?.Request.Headers["User-Agent"].ToString()!;

    public string IpAddress => _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.MapToIPv4().ToString()!;
    
}