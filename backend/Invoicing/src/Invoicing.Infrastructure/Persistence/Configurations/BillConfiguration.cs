using Invoicing.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Invoicing.Infrastructure.Persistence.Configurations
{
    public class BillConfiguration : IEntityTypeConfiguration<Bill>
    {
        public void Configure(EntityTypeBuilder<Bill> builder)
        {
            builder.Property(b => b.Status)
                .HasConversion(bs => bs.ToString(), bs => (BillStatus)Enum.Parse(typeof(BillStatus), bs));

            builder.Property(b => b.ApprovalStatus)
                .HasConversion(bs => bs.ToString(), bs => (ApprovalStatus)Enum.Parse(typeof(ApprovalStatus), bs));

            builder.HasOne(b => b.Invoice)
                .WithOne();
        }
    }
}