namespace Administration.Infrastructure.Services;
public class TwoFactorSettings
{
    public int MaxFailedAttemtps { get; set; }
    public int LockoutDurationInMinutes { get; set; }
}
