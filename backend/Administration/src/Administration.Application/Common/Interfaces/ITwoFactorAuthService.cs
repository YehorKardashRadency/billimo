using Administration.Application.Common.Models;
using Administration.Application.Common.Models.Identity;
using Administration.Domain.Entities;

namespace Administration.Application.Common.Interfaces;
public interface ITwoFactorAuthService
{
    Task<LoginResult?> TwoFactorAuthAsync(LoginRequest loginRequest, User user);

    Task<Result> ResendTwoFactoreCodeAsync(LoginRequest loginRequest);
}
