using Invoicing.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Infrastructure.Persistence.Configurations;
public class BillCancellationConfiguration : IEntityTypeConfiguration<BillCancellation>
{
    public void Configure(EntityTypeBuilder<BillCancellation> builder)
    {
        builder.HasOne(x => x.Bill).WithOne(x => x.BillCancellation).HasForeignKey<Bill>(x => x.BillCancellationId);
        builder.HasOne(x => x.Company).WithMany();
    }
}