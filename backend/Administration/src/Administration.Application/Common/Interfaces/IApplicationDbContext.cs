using Administration.Application.Common.Models.Identity;
using Administration.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Administration.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Address> Addresses { get; set; }
        DbSet<Company> Companies { get; set; }
        DbSet<LoginAttempt> LoginAttemps { get; set; }
        DbSet<Notification> Notifications { get; set; }
        DbSet<PendingAction> PendingActions { get; set; }
        DbSet<User> Users { get; set; }
        DbSet<RefreshToken> RefreshTokens { get; set; }

        DbSet<PaymentMethod> PaymentMethods { get; set; }
        DbSet<PlaidBankAccount> PlaidBankAccounts { get; set; }
        DbSet<PlaidBankIntegration> PlaidBankIntegration { get; set; }

        DatabaseFacade Database { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        public EntityEntry<T> Entry<T>(T entity) where T: class;
    }
}
