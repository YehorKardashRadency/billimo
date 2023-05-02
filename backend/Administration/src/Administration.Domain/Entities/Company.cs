using Administration.Domain.Common;

namespace Administration.Domain.Entities
{
    public class Company : BaseEntity
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public byte[]? Logo { get; set; }
        public long? DefaultAddressId { get; set; }
        public bool IsVerified { get; set; }
        public BusinessType BusinessType { get; set; }
        public string? Tax { get; set; }
        public string? Registration { get; set; }

        public bool OnPayingInvoicesHigherThan { get; set; } = true;
        public bool OnSendingInvoicesHigherThan { get; set; } = true;
        public decimal PayingInvoicesThreshold { get; set; } = 1000M;
        public decimal SendingInvoicesThreshold { get; set; } = 1000M;
        public bool OnSendingAllInvoices { get; set; } = false;

        public ICollection<User> Employees { get; set; }
        public ICollection<Address> Addresses { get; set; }
        public ICollection<Notification> Notifications { get; set; }
        public ICollection<PaymentMethod> PaymentMethods { get; set; }
        public ICollection<PendingAction> PendingActions { get; set; }
    }
}