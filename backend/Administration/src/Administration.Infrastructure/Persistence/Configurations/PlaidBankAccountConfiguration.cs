using Administration.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Administration.Infrastructure.Persistence.Configurations;
public class PlaidBankAccountConfiguration : IEntityTypeConfiguration<PlaidBankAccount>
{
    public void Configure(EntityTypeBuilder<PlaidBankAccount> builder)
    {
        builder.HasOne(x => x.PlaidBankIntegration).WithMany(x => x.Accounts).HasForeignKey(x => x.PlaidBankIntegrationId);
    }
}
