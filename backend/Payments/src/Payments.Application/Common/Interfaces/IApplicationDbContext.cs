using Microsoft.EntityFrameworkCore;
using Payments.Domain.Entities;

namespace Payments.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        public DbSet<PaymentStatistic> PaymentStatistics { get; set; }
        public DbSet<PostponedPayment> PostponedPayments { get; set; }
        public DbSet<PostponedPaymentInfo> PostponedPaymentInfo { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<PlaidTransfer> PlaidTransfers { get; set; }
        public DbSet<PlaidTransfersEventSync> PlaidTransfersEventSync { get; set; }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    }
}