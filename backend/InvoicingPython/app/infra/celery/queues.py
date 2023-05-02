import attr


@attr.s(frozen=True)
class Queues:
    BILL_NOTIFICATION_QUEUE = 'bill-notification-queue'
    BILL_EMAIL_QUEUE = 'bill-email-queue'
    UPDATE_PAYMENT_STATISTIC_QUEUE = 'update-payment-statistic-queue'
    UPDATE_BUYER_INVOICES_QUEUE = 'update-buyer-invoices-queue'
    UPDATE_COMPANY_INFO_QUEUE = 'update-company-info-queue'
    UPDATE_BUYER_STATISTIC_QUEUE = 'update-payment-statistic-queue'
