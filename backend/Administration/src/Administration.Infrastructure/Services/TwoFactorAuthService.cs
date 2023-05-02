using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Models;
using Administration.Application.Common.Models.Identity;
using Administration.Domain.Entities;
using Administration.Infrastructure.Persistence;
using EventBus.Messages.Events;
using MassTransit;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Administration.Infrastructure.Services;
public class TwoFactorAuthService: ITwoFactorAuthService
{
    private readonly TwoFactorSettings _twoFactorSettings;
    private readonly ApplicationDbContext _dbContext;
    private readonly IPublishEndpoint _publishEndpoint;

    public TwoFactorAuthService(
        IOptions<TwoFactorSettings> twoFactorSettings,
        IPublishEndpoint publishEndpoint,
        ApplicationDbContext dbContext)
    {
        _twoFactorSettings = twoFactorSettings.Value;
        _publishEndpoint = publishEndpoint;
        _dbContext = dbContext;
    }

    public async Task<LoginResult?> TwoFactorAuthAsync(LoginRequest loginRequest, User user)
    {
        if (IsUserLockedOut(user))
            return LoginResult.TwoFactorUserSuspended();
        
        if (loginRequest.TwoFactorCode == null)
        {
            var code = await GenerateTwoFactorCodeAsync(user);
            await SendTwoFactorCodeToEmailAsync(code, user.Email);

            return LoginResult.TwoFactorRequired();
        }

        if (await CheckTwoFactorCodeAsync(user, loginRequest.TwoFactorCode))
        {
            await ResetWrongAttemptsAsync(user);
            // Should generate a new token and send it
            return null;
        }

        await ProceedWithWrongCodeAsync(user);
        return LoginResult.IncorrectTwoFactorCode();
    }

    public async Task<Result> ResendTwoFactoreCodeAsync(LoginRequest loginRequest)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == loginRequest.Email);
        if (user == null)
            return Result.Failure(new string[] { "User doesn't exist" });

        if (IsUserLockedOut(user))
            return LoginResult.TwoFactorUserSuspended();

        var hasher = new PasswordHasher<User>();
        var verifyResult = hasher.VerifyHashedPassword(user, user.Password, loginRequest.Password);

        if (verifyResult == PasswordVerificationResult.Failed)
            return Result.Failure(new string[] { "Wrong password" });

        var code = await GenerateTwoFactorCodeAsync(user);
        await SendTwoFactorCodeToEmailAsync(code, user.Email);

        return Result.Success();
    }

    private async Task ResetWrongAttemptsAsync(User user)
    {
        user.TwoFactorFailedAttempts = 0;
        user.TwoFactorLastFailedAttempt = null;

        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();
    }

    private async Task<bool> ProceedWithWrongCodeAsync(User user)
    {
        TimeSpan lockoutDuration = TimeSpan.FromMinutes(_twoFactorSettings.LockoutDurationInMinutes);

        // Check if the user is locked out
        if (user.TwoFactorFailedAttempts >= _twoFactorSettings.MaxFailedAttemtps)
        {
            if (user.TwoFactorLastFailedAttempt.HasValue && 
                user.TwoFactorLastFailedAttempt.Value.Add(lockoutDuration) > DateTime.UtcNow)
            {
                // The user is locked out
                return false;
            }
            else
            {
                // Reset the failed attempts count
                user.TwoFactorFailedAttempts = 0;
            }
        }

        user.TwoFactorFailedAttempts++;
        user.TwoFactorLastFailedAttempt = DateTime.UtcNow;

        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();

        return true;
    }

    private bool IsUserLockedOut(User user)
    {
        TimeSpan lockoutDuration = TimeSpan.FromMinutes(_twoFactorSettings.LockoutDurationInMinutes);

        if (user.TwoFactorFailedAttempts >= _twoFactorSettings.MaxFailedAttemtps
            && user.TwoFactorLastFailedAttempt.HasValue 
            && user.TwoFactorLastFailedAttempt.Value.Add(lockoutDuration) > DateTime.UtcNow)
                return true;

        return false;
    }

    private async Task SendTwoFactorCodeToEmailAsync(TwoFactorAuthCode code, string userEmail)
    {
        var message = new SendTwoFactorAuthCodeEvent
        {
            Email = userEmail,
            Code = code.Code,
            Subject = "2FA Auth Code",
        };

        Console.WriteLine(code.Code);

        await _publishEndpoint.Publish(message);
    }

    private async Task<TwoFactorAuthCode> GenerateTwoFactorCodeAsync(User user)
    {
        var random = new Random();
        var randomNumber = random.Next(100000, 999999).ToString();

        var newCode = new TwoFactorAuthCode()
        {
            UserId = user.Id,
            Code = randomNumber,
            ExpirationDate = DateTime.UtcNow.AddMinutes(10),
        };

        _dbContext.TwoFactorAuthCodes.Add(newCode);
        await _dbContext.SaveChangesAsync();

        return newCode;
    }

    public async Task<bool> CheckTwoFactorCodeAsync(User user, string code)
    {
        var foundCode = await _dbContext.TwoFactorAuthCodes
            .Include(x => x.User)
            .Where(x => x.User.Id == user.Id)
            .OrderByDescending(x => x.Id)
            .FirstOrDefaultAsync();

        if (foundCode == null || foundCode.Code != code 
            || foundCode.ExpirationDate <= DateTime.UtcNow || foundCode.Disabled)
            return false;

        foundCode.Disabled = true;
        _dbContext.TwoFactorAuthCodes.Update(foundCode);
        await _dbContext.SaveChangesAsync();

        return true;
    }
}
