namespace EventBus.Messages.Common
{
    public static class EventBusConstants
    {
        public const string UserRegistrationQueue = "user-registration-queue";
        public const string BillNotificationQueue = "bill-notification-queue";
        public const string NotificationQueue = "notification-queue";
        public const string BillEmailQueue = "bill-email-queue";
        public const string SendTwoFactorAuthCodeQueue = "send-two-factor-auth-code-queue";
        public const string UpdateBuyerInvoicesQueue = "update-buyer-invoices-queue";
        public const string UpdateCompanyInfoQueue = "update-company-info-queue";
        public const string UpdatePaymentStatisticQueue = "update-payment-statistic-queue";
        public const string CreatePaymentStatisticQueue = "create-payment-statistic-queue";
        public const string UpdateBuyerStatisticQueue = "update-payment-statistic-queue";
    }
}
