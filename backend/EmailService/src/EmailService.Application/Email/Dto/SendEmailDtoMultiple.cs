namespace EmailService.Application.Email.Dto;

public class SendEmailDtoMultiple
{
    public IEnumerable<string> ReceiverEmails { get; set; }
    public string? ReceiverName { get; set; }
    public string? HtmlContent { get; set; }
    public string? Subject { get; set; }
    public string? LinkUrl { get; set; }
}
