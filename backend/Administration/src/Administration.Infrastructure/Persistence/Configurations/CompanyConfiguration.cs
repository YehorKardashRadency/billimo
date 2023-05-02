using Administration.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Administration.Infrastructure.Persistence.Configurations
{
    public class CompanyConfiguration : IEntityTypeConfiguration<Company>
    {
        public void Configure(EntityTypeBuilder<Company> builder)
        {
            builder.HasMany(c => c.Employees).WithOne(e => e.Company).HasForeignKey(e => e.CompanyId);
            builder.HasMany(c => c.Addresses).WithOne(a => a.Company).HasForeignKey(a => a.CompanyId);
            builder.HasMany(c => c.Notifications).WithOne(n => n.Company).HasForeignKey(n => n.CompanyId);
            builder.HasMany(c => c.PaymentMethods).WithOne(pm => pm.Company).HasForeignKey(pm => pm.CompanyId);
            builder.HasMany(c => c.PendingActions).WithOne(pa => pa.Company).HasForeignKey(pa => pa.CompanyId);

            builder.Property(c => c.PayingInvoicesThreshold).HasColumnType("Money");
            builder.Property(c => c.SendingInvoicesThreshold).HasColumnType("Money");
        }
    }
}