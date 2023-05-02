namespace EmailService.RazorHtmlEmails.Views.Emails.Bill;

public record BillEmailViewModel(string InvitationLinkUrl,string SenderName,string Total, string Password);
