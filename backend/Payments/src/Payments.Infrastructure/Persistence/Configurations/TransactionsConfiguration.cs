using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Payments.Domain.Entities;

namespace Payments.Infrastructure.Persistence.Configurations;
public class TransactionsConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.HasOne(x => x.Buyer).WithMany(x => x.Buy).HasForeignKey(e => e.BuyerId);
        builder.HasOne(x => x.Seller).WithMany(x => x.Sell).HasForeignKey(e => e.SellerId);

        builder.Property(x => x.Amount).HasColumnType("Money");
    }
}
