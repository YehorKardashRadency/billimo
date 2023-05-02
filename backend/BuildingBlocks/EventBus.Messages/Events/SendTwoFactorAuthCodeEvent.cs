namespace EventBus.Messages.Events
{
    public class SendTwoFactorAuthCodeEvent : IntegrationBaseEvent
    {
        public string Email { get; set; }
        public string Subject { get; set; }
        public string Code { get; set; }
    }
}
