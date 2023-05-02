namespace Invoicing.Application.Common.Models;

public class ApprovalSettings
{
    public bool OnPayingInvoicesHigherThan { get; set; }
    public bool OnSendingInvoicesHigherThan { get; set; }

    public decimal PayingInvoicesThreshold { get; set; }
    public decimal SendingInvoicesThreshold { get; set; }

    public bool OnSendingAllInvoices { get; set; } = false;   
}