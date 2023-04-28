import attr


@attr.s(frozen=True)
class MessageTypes:
    BILL_EMAIL = [
        "urn:message:EventBus.Messages.Events:BillEmail",
    ]
    BILL_NOTIFICATION = [
        "urn:message:EventBus.Messages.Events:BillNotificationEvent",
        "urn:message:EventBus.Messages.Events:IntegrationBaseEvent"
    ]
    UPDATE_PAYMENT_STATISTIC = [
        "urn:message:EventBus.Messages.Events:UpdatePaymentStatisticEvent",
        "urn:message:EventBus.Messages.Events:IntegrationBaseEvent"
    ]
