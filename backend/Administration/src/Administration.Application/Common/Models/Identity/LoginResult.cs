namespace Administration.Application.Common.Models.Identity;
public class LoginResult : Result
{
    public LoginResult(IEnumerable<string> errors):base(false, errors)
    {
    }

    public LoginResult(string error) : base(false, new List<string>() { error })
    {
    }

    public LoginResult(string token, string refreshToken):base(true, new List<string>())
    {
        Token = token;
        RefreshToken = refreshToken;
    }

    public string Token { get; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public bool TwoFactorCodeRequired { get; set; }

    public static LoginResult TwoFactorRequired()
    {
        var result = new LoginResult(new List<string>())
        {
            Succeeded = true,
            TwoFactorCodeRequired = true,
        };

        return result;
    }

    public static LoginResult IncorrectTwoFactorCode()
    {
        var result = new LoginResult("Incorrect code");

        return result;
    }

    public static LoginResult TwoFactorUserSuspended()
    {
        var result = new LoginResult("You've made too many requests recently. Please wait and try your request again later.");

        return result;
    }
}
