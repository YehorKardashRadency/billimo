namespace Invoicing.Domain.Entities;

public enum InvoiceType
{
    /// <summary>
    /// Waiting to become a bill.
    /// </summary>
    Current,
    /// <summary>
    /// Is a template.
    /// </summary>
    Template,
    /// <summary>
    /// Is archived
    /// </summary>
    Archived,
}