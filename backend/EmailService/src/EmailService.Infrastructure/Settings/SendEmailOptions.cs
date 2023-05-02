namespace EmailService.Infrastructure.Settings;

public class SendEmailOptions
{
    public string FromName { get; set; }
    public string FromEmail { get; set; }
    public string ApiKey { get; set; }
}
