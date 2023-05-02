using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Models;
using Administration.Application.Common.Models.Identity;
using Administration.Domain.Entities;
using Administration.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Administration.Infrastructure.Services;
public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly TokenValidationParameters _tokenValidationParameters;
    private readonly ApplicationDbContext _dbContext;
    private readonly ITwoFactorAuthService _twoFactorAuthService;

    public AuthService(
        IConfiguration configuration,
        ITwoFactorAuthService twoFactorAuthService,
        TokenValidationParameters tokenValidationParameters,
        ApplicationDbContext dbContext)
    {
        _configuration = configuration;
        _tokenValidationParameters = tokenValidationParameters;
        _twoFactorAuthService = twoFactorAuthService;
        _dbContext = dbContext;
    }

    public async Task<LoginResult> LoginAsync(LoginRequest loginRequest)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == loginRequest.Email);
        if (user == null)
            return new LoginResult("User doesn't exist");

        var hasher = new PasswordHasher<User>();
        var verifyResult = hasher.VerifyHashedPassword(user, user.Password, loginRequest.Password);

        if (verifyResult == PasswordVerificationResult.Failed)
            return new LoginResult("Wrong password");

        if (user.TwoFactorEnabled)
        {
            var twoFactorLoginResult = await _twoFactorAuthService.TwoFactorAuthAsync(loginRequest, user);

            if (twoFactorLoginResult != null)
                return twoFactorLoginResult;
        }

        return await GenerateToken(user);
    }

    private async Task<LoginResult> GenerateToken(User user)
    {
        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtConfig:Secret"]));
        var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

        var jwtId = Guid.NewGuid().ToString();
        var tokeOptions = new JwtSecurityToken(
            issuer: _tokenValidationParameters.ValidIssuer,
            audience: _tokenValidationParameters.ValidAudience,
            claims: new List<Claim> {
                new Claim("id", user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, jwtId),
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim("role", (user.Role).ToString()),
                new Claim("companyid",user.CompanyId.ToString())
            },
            expires: DateTime.Now.AddMinutes(600),
            signingCredentials: signinCredentials
        );
        var token = new JwtSecurityTokenHandler().WriteToken(tokeOptions);

        var refreshToken = new RefreshToken
        {
            JwtId = jwtId,
            IsUsed = false,
            IsRevoked = false,
            UserId = user.Id,
            AddedDate = DateTime.UtcNow,
            ExpiryDate = DateTime.UtcNow.AddDays(10),
            Token = RandomString(35) + Guid.NewGuid()
        };

        await _dbContext.RefreshTokens.AddAsync(refreshToken);
        await _dbContext.SaveChangesAsync();

        return new LoginResult(token, refreshToken.Token);
    }

    public async Task<LoginResult> RefreshTokenAsync(TokenRequest tokenRequest)
    {
        var tokerHandler = new JwtSecurityTokenHandler();

        try
        {
            var principal = tokerHandler.ValidateToken(tokenRequest.Token, _tokenValidationParameters, out var validatedToken);
            if (validatedToken is JwtSecurityToken jwtSecurityToken) {
                var result = jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase);
                if (result == false)
                {
                    return new LoginResult("not valid security algorithm");
                }
            }

            var expClaim = principal.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Exp);
            if (expClaim is null) {
                return new LoginResult("We cannot refresh this since the token has not expired");
            }

            var jwtIdClaim = principal.Claims.SingleOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti);
            if (jwtIdClaim is null)
            {
                return new LoginResult("the token doenst mateched the saved token");
            }

            var utcExpireDate = long.Parse(expClaim.Value);
            var expiryDate = UnixTimeStampToDateTime(utcExpireDate);
            if (expiryDate >= DateTime.UtcNow)
            {
                return new LoginResult("We cannot refresh this since the token has not expired");
            }

            var storedRefreshToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(x => x.Token == tokenRequest.RefreshToken);

            if (storedRefreshToken == null)
            {
                return new LoginResult("refresh token doesnt exist");
            }

            if (DateTime.UtcNow > storedRefreshToken.ExpiryDate)
            {
                return new LoginResult("token has expired, user needs to relogin");
            }

            if (storedRefreshToken.IsUsed)
            {
                //Revoke all refresh tokens.
                var userIdClaim = principal.Claims.FirstOrDefault(x => x.Type == "id");
                if (userIdClaim != null 
                    && long.TryParse(userIdClaim.Value, out long userId))
                {
                        var tokens = await _dbContext.RefreshTokens
                            .Where(x => x.UserId == userId 
                                    && x.IsRevoked == false
                                    && x.IsUsed == false).ToListAsync();
                        tokens.ForEach(x => x.IsRevoked = true);
                        await _dbContext.SaveChangesAsync();                     
                }
                return new LoginResult("token has been used");
            }

            if (storedRefreshToken.IsRevoked)
            {
                return new LoginResult("token has been revoked");
            }

            var jti = jwtIdClaim.Value;
            if (storedRefreshToken.JwtId != jti)
            {
                return new LoginResult("the token doenst mateched the saved token");
            }

            storedRefreshToken.IsUsed = true;
            _dbContext.RefreshTokens.Update(storedRefreshToken);      

            var dbUser = _dbContext.Users.FirstOrDefault(x => x.Id == storedRefreshToken.UserId);
            if (dbUser == null)
            {
                await _dbContext.SaveChangesAsync();
                return new LoginResult("user doesnt exist");
            }
            return await GenerateToken(dbUser);
        }
        catch
        {
            return new LoginResult("unhandled exception");
        }
    }

    public async Task<Result> DeleteRefreshTokenAsync(string refreshToken)
    {
        var storedRefreshToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(x => x.Token == refreshToken);

        if (storedRefreshToken == null) return Result.Failure(new List<string> { "refresh token doesn't exist" });

        if (!storedRefreshToken.IsUsed) {
            _dbContext.RefreshTokens.Remove(storedRefreshToken);
            await _dbContext.SaveChangesAsync();
        }

        return Result.Success();
    }

    private DateTime UnixTimeStampToDateTime(long unixTimeStamp)
    {
        DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
        dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToUniversalTime();
        return dtDateTime;
    }

    private string RandomString(int length)
    {
        var random = new Random();
        var chars = "abcdefghijklmnopqrstuvwxyz1234567890";
        return new string(Enumerable.Repeat(chars, length)
            .Select(x => x[random.Next(x.Length)])
            .ToArray());
    }
}
