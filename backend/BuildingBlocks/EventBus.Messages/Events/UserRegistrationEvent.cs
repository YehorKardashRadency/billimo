namespace EventBus.Messages.Events
{
    public class UserRegistrationEvent : IntegrationBaseEvent
    {
        public long UserId { get; set; }
        public string Email { get; set; }
        public string Subject { get; set; }
        public string UserName { get; set; }
        public string OneTimePassword { get; set; }
    }
}
