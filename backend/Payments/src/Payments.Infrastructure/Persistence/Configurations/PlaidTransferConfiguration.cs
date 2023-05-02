using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Payments.Domain.Entities;

namespace Payments.Infrastructure.Persistence.Configurations;
public class PlaidTransferConfiguration : IEntityTypeConfiguration<PlaidTransfer>
{
    public void Configure(EntityTypeBuilder<PlaidTransfer> builder)
    {
        builder.HasOne(x => x.Transaction).WithMany(x => x.PlaidTransfers).HasForeignKey(e => e.TransactionId);
    }
}
