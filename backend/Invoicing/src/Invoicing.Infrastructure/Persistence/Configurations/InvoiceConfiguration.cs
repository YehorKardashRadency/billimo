using Invoicing.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Invoicing.Infrastructure.Persistence.Configurations
{
    public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
    {
        public void Configure(EntityTypeBuilder<Invoice> builder)
        {
            builder.HasMany(i => i.Items).WithOne(ii => ii.Invoice).HasForeignKey(ii => ii.InvoiceId);
            builder.Property(i => i.BuyerId).IsRequired(false);
            builder.HasOne(i => i.Buyer).WithMany().HasForeignKey(x => x.BuyerId);
            builder.HasOne(i => i.Seller).WithMany().HasForeignKey(x => x.SellerId);
        }
    }
}