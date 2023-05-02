namespace EmailService.Application.Email.Dto;

public class SendEmailDto
{
    public string? ReceiverEmail { get; set; }
    public string? ReceiverName { get; set; }
    public string? ReceiverOneTimePassword { get; set; }
    public string? HtmlContent { get; set; }
    public string? Subject { get; set; }
}
