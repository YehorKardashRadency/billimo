import attr


@attr.s(frozen=True)
class Exchanges:
    BILL_NOTIFICATION_EXCHANGE = 'bill-notification-queue'
    BILL_EMAIL_EXCHANGE = 'bill-email-queue'
    UPDATE_PAYMENT_STATISTIC_EXCHANGE = 'EventBus.Messages.Events:UpdatePaymentStatisticEvent'
    UPDATE_BUYER_INVOICES_EXCHANGE = 'update-buyer-invoices-queue'
    UPDATE_COMPANY_INFO_EXCHANGE = 'update-company-info-queue'
    UPDATE_BUYER_STATISTIC_EXCHANGE = 'update-payment-statistic-queue'
