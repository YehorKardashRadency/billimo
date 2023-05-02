using Administration.Application.Common.Models;
using Administration.Application.Common.Models.Identity;

namespace Administration.Application.Common.Interfaces;
public interface IAuthService
{
    public Task<LoginResult> LoginAsync(LoginRequest loginRequest);
    public Task<LoginResult> RefreshTokenAsync(TokenRequest tokenRequest);
    public Task<Result> DeleteRefreshTokenAsync(string refreshToken);
}
