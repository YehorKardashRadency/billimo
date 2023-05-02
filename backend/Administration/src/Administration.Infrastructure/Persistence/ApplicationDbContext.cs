using System.Reflection;
using System.Reflection.Emit;
using System.Reflection.Metadata;
using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Models.Identity;
using Administration.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Administration.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Address> Addresses { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<LoginAttempt> LoginAttemps { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<PendingAction> PendingActions { get; set; }
        public DbSet<User> Users { get; set; }
        
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<TwoFactorAuthCode> TwoFactorAuthCodes { get; set; }

        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<PlaidBankAccount> PlaidBankAccounts { get; set; }
        public DbSet<PlaidBankIntegration> PlaidBankIntegration { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            base.OnModelCreating(builder);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
