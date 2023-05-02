namespace Administration.Domain.Entities;

public enum NotificationOperation
{
    None,
    InvoiceSent,
    InvoiceReceived,
    Message,
    InvoiceApproved,
    InvoiceDeclined,
}
